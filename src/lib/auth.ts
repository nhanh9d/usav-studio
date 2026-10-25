import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import dbConnect from './mongodb';
import User from '@/models/User';
import { fetchGuildRoles, isGuildConfigured, isMembershipRequired, resolveSiteRole } from './discord';

export const SIGN_IN_PATH = '/booster/auth/signin';

// How often a signed-in user's Discord roles are re-read, so role changes in Discord reach the site
// without a fresh login.
const ROLE_REFRESH_MS = 10 * 60 * 1000;

interface DiscordSignIn {
  discordId: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessToken: string;
}

// Finds or creates the site user for a Discord account. Users who registered before Discord login are
// linked by email. When a guild is configured, the site role follows the user's Discord roles;
// otherwise the role stored in the database is kept.
async function syncDiscordUser({ discordId, name, email, image, accessToken }: DiscordSignIn) {
  await dbConnect();
  const user =
    (await User.findOne({ discordId })) ??
    (email ? await User.findOne({ email }) : null) ??
    // Discord accounts without an email still need a unique one to satisfy the existing index.
    new User({ email: email || `${discordId}@discord.invalid` });

  user.discordId = discordId;
  user.name = name || user.name || 'Discord user';
  user.avatar = image || user.avatar;
  user.provider = 'discord';

  if (isGuildConfigured()) {
    const roles = (await fetchGuildRoles(accessToken)) ?? [];
    user.discordRoles = roles;
    user.role = resolveSiteRole(roles);
  }

  await user.save();
  return user;
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      authorization: { params: { scope: 'identify email guilds.members.read' } },
      // Discord now adds `iss` to the OAuth callback; openid-client rejects it unless the issuer is declared.
      // The value comes from https://discord.com/.well-known/openid-configuration.
      issuer: 'https://discord.com',
    }),
  ],
  session: {
    strategy: 'jwt',
    // Matches the Discord access token lifetime, so role refreshes never run on an expired token.
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: SIGN_IN_PATH,
    error: SIGN_IN_PATH,
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider !== 'discord' || !account.access_token) return false;
      if (!isMembershipRequired()) return true;
      const roles = await fetchGuildRoles(account.access_token);
      return roles ? true : `${SIGN_IN_PATH}?error=NotInGuild`;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'discord' && account.access_token) {
        const dbUser = await syncDiscordUser({
          discordId: account.providerAccountId,
          name: user?.name,
          email: user?.email,
          image: user?.image,
          accessToken: account.access_token,
        });
        // Carts and orders reference the Mongo user, so the session id must be its _id, not the Discord id.
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.discordAccessToken = account.access_token;
        token.rolesCheckedAt = Date.now();
        return token;
      }

      const checkedAt = (token.rolesCheckedAt as number | undefined) ?? 0;
      if (isGuildConfigured() && token.discordAccessToken && Date.now() - checkedAt > ROLE_REFRESH_MS) {
        token.rolesCheckedAt = Date.now();
        try {
          const roles = (await fetchGuildRoles(token.discordAccessToken as string)) ?? [];
          token.role = resolveSiteRole(roles);
          await dbConnect();
          await User.updateOne({ _id: token.id }, { role: token.role, discordRoles: roles });
        } catch (error) {
          // Keep the last known role; the next refresh will try again.
          console.error('Discord role refresh failed:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
