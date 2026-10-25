'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Upload, Bell, Mail, Tag, Trash2, AlertTriangle, Link2, Check } from 'lucide-react';
import Button from '@/components/booster/ui/Button';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  // Notification toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/booster/auth/signin');
    if (session?.user?.name) setName(session.user.name);
  }, [status, session]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (status === 'loading') {
    return <div className="bg-card rounded-xl h-96 animate-pulse" />;
  }

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Account Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* Avatar Upload Section */}
        <div className="bg-card rounded-xl p-6 border border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-bold text-white border-4 border-[#2a2a2a]">
                {userInitial}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Upload size={20} className="text-white" />
              </div>
            </div>
            <div>
              <button className="bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary rounded-lg px-4 py-2 text-sm font-medium transition-colors inline-flex items-center gap-2">
                <Upload size={16} />
                Upload Photo
              </button>
              <p className="text-muted text-xs mt-2">JPG, PNG or WebP. Max 2MB.</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-card rounded-xl p-6 border border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1.5">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Email</label>
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-muted cursor-not-allowed"
              />
            </div>
            <Button onClick={handleSave} className="gap-2">
              {saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-card rounded-xl p-6 border border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Email Notifications</p>
                  <p className="text-muted text-xs">Receive important updates via email</p>
                </div>
              </div>
              <button
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  emailNotifs ? 'bg-primary' : 'bg-[#333]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                  emailNotifs ? 'left-[22px]' : 'left-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
                  <Bell size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Order Updates</p>
                  <p className="text-muted text-xs">Get notified when your order status changes</p>
                </div>
              </div>
              <button
                onClick={() => setOrderUpdates(!orderUpdates)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  orderUpdates ? 'bg-primary' : 'bg-[#333]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                  orderUpdates ? 'left-[22px]' : 'left-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center">
                  <Tag size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Promotions</p>
                  <p className="text-muted text-xs">Receive deals, discounts, and special offers</p>
                </div>
              </div>
              <button
                onClick={() => setPromotions(!promotions)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  promotions ? 'bg-primary' : 'bg-[#333]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                  promotions ? 'left-[22px]' : 'left-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-card rounded-xl p-6 border border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white mb-4">Connected Accounts</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#5865F2]/15 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Discord</p>
                  <p className="text-muted text-xs">Signed in as {session?.user?.name}</p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-500/20 text-green-400">
                <span className="flex items-center gap-1"><Link2 size={12} /> Connected</span>
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card rounded-xl p-6 border border-red-500/30">
          <h2 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle size={20} />
            Danger Zone
          </h2>
          <p className="text-muted text-sm mb-4">
            Once you delete your account, there is no going back. All your data, orders, and balance will be permanently removed.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          ) : (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm font-medium mb-3">
                Are you sure? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-[#2a2a2a] hover:bg-[#333] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors inline-flex items-center gap-2">
                  <Trash2 size={14} />
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
