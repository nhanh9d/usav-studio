'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DiscordButton from '@/components/booster/auth/DiscordButton';
import { useLocale } from '@/components/booster/LocaleProvider';

const LOGO_IMAGE = '/images/logo-white.png';

function SignInCard() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const errorCode = searchParams.get('error');
  // Error codes NextAuth (and our signIn callback) append to this page.
  const error = errorCode ? t.signIn.errors[errorCode] ?? t.signIn.failed : '';
  const callbackUrl = searchParams.get('callbackUrl') || '/booster';

  return (
    <div className="bg-card rounded-xl p-8 border border-[#2a2a2a] shadow-2xl shadow-black/50">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img
          src={LOGO_IMAGE}
          alt="USAV Studio"
          className="h-16 w-auto object-contain"
        />
      </div>

      <h1 className="text-2xl font-bold text-white text-center mb-1">{t.signIn.welcome}</h1>
      <p className="text-muted text-sm text-center mb-6">
        {t.signIn.intro}
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <DiscordButton callbackUrl={callbackUrl} />
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center relative">
      {/* Gaming-themed background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Suspense fallback={<div className="bg-card rounded-xl h-72 animate-pulse" />}>
          <SignInCard />
        </Suspense>
      </div>
    </div>
  );
}
