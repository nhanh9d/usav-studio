// Reads a signed-in user's roles in the USAV Discord server and turns them into a site role.
// Discord roles belong to the server (guild), not to a channel, so we ask Discord for the user's
// membership in DISCORD_GUILD_ID using their own OAuth token (scope guilds.members.read) — no bot needed.

// Highest privilege first: a user holding several mapped roles gets the first one listed here.
export const SITE_ROLES = ['admin', 'booster', 'buyer', 'user'] as const;
export type SiteRole = (typeof SITE_ROLES)[number];

const DISCORD_API = 'https://discord.com/api/v10';

export function isGuildConfigured() {
  return Boolean(process.env.DISCORD_GUILD_ID);
}

export function isMembershipRequired() {
  return isGuildConfigured() && process.env.DISCORD_REQUIRE_MEMBERSHIP === 'true';
}

// DISCORD_ROLE_MAP="<discord role id>:<site role>,..." e.g. "1290000000000000001:admin,1290000000000000002:admin"
function parseRoleMap() {
  const map = new Map<string, SiteRole>();
  for (const pair of (process.env.DISCORD_ROLE_MAP || '').split(',')) {
    const [roleId, siteRole] = pair.split(':').map((part) => part?.trim());
    if (roleId && SITE_ROLES.includes(siteRole as SiteRole)) {
      map.set(roleId, siteRole as SiteRole);
    }
  }
  return map;
}

// Returns the user's Discord role IDs in the guild, or null when they are not a member.
// Throws on any other failure (expired token, rate limit) so callers can keep the last known role.
export async function fetchGuildRoles(accessToken: string): Promise<string[] | null> {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Discord member lookup failed with ${res.status}`);
  const member: { roles: string[] } = await res.json();
  return member.roles;
}

export function resolveSiteRole(discordRoleIds: string[]): SiteRole {
  const map = parseRoleMap();
  const granted = new Set(discordRoleIds.map((id) => map.get(id)));
  return SITE_ROLES.find((role) => granted.has(role)) ?? 'user';
}
