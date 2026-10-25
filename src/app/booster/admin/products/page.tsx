'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, Star, ChevronLeft, ChevronRight, ChevronDown, Filter, Gamepad2 } from 'lucide-react';
import Button from '@/components/booster/ui/Button';
import ImageManager from '@/components/booster/admin/ImageManager';
import { formatPrice } from '@/lib/utils';
import { slugify } from '@/lib/utils';
import { IProduct, IWeaponSkin, ICharacterSkin } from '@/types';
import Image from 'next/image';

const PLACEHOLDER_IMG = '/images/booster-placeholder.svg';
const ITEMS_PER_PAGE = 10;

const emptyProduct = {
  title: '',
  slug: '',
  description: '',
  price: 0,
  originalPrice: 0,
  cost: 0,
  discount: 0,
  stock: 10,
  category: 'accounts',
  server: '',
  images: [] as string[],
  featured: false,
  status: 'active' as 'active' | 'inactive' | 'sold_out',
  accountCode: '',
  accountType: '',
  accountLogin: '',
  accountPassword: '',
  level: '' as string | number,
  rank: '',
  gameCoins: '' as string | number,
  weaponSkins: [] as IWeaponSkin[],
  characterSkins: [] as ICharacterSkin[],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IProduct | null>(null);
  const [form, setForm] = useState(emptyProduct);

  // Search, filter, pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Game details section
  const [showGameDetails, setShowGameDetails] = useState(false);

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || slugify(form.title);
    const payload = {
      ...form,
      slug,
      images: form.images.filter(Boolean),
      level: form.level === '' ? null : Number(form.level),
      gameCoins: form.gameCoins === '' ? null : Number(form.gameCoins),
    };

    if (editing) {
      await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: editing._id, ...payload }),
      });
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    setShowForm(false);
    setEditing(null);
    setForm(emptyProduct);
    fetchProducts();
  };

  const handleEdit = (product: IProduct) => {
    setEditing(product);
    setForm({
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      cost: product.cost || 0,
      discount: product.discount,
      stock: product.stock,
      category: product.category,
      server: product.server,
      images: product.images.length ? product.images : [],
      featured: product.featured,
      status: product.status,
      accountCode: product.accountCode || '',
      accountType: product.accountType || '',
      accountLogin: product.accountLogin || '',
      accountPassword: product.accountPassword || '',
      level: product.level ?? '',
      rank: product.rank || '',
      gameCoins: product.gameCoins ?? '',
      weaponSkins: product.weaponSkins || [],
      characterSkins: product.characterSkins || [],
    });
    const hasGameData = !!(product.accountCode || product.accountType || product.accountLogin || product.accountPassword || product.level || product.rank || product.gameCoins || (product.weaponSkins && product.weaponSkins.length) || (product.characterSkins && product.characterSkins.length));
    setShowGameDetails(hasGameData);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchProducts();
  };

  const toggleFeatured = async (product: IProduct) => {
    await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: product._id, featured: !product.featured }),
    });
    fetchProducts();
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map((p) => p._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  if (loading) {
    return <div className="bg-card rounded-xl h-96 animate-pulse" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Products</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setForm(emptyProduct);
            setShowForm(true);
          }}
          className="gap-2"
        >
          <Plus size={18} /> Add Product
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl p-6 border border-[#2a2a2a] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              {editing ? 'Edit Product' : 'New Product'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-muted hover:text-white">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              >
                <option value="accounts">Game Accounts</option>
                <option value="topup">Top-Up</option>
                <option value="items">In-Game Items</option>
                <option value="currency">Game Currency</option>
                <option value="boost">Boosting</option>
                <option value="coaching">Coaching</option>
                <option value="services">Other Services</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Strike Price ($) <span className="text-xs text-muted/60">— shown crossed out</span></label>
              <input
                type="number"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) => {
                  const originalPrice = parseFloat(e.target.value) || 0;
                  const discount = originalPrice > 0 && form.price < originalPrice
                    ? Math.round(((originalPrice - form.price) / originalPrice) * 100)
                    : 0;
                  setForm({ ...form, originalPrice, discount });
                }}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Selling Price ($) <span className="text-xs text-muted/60">— customer pays</span></label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => {
                  const price = parseFloat(e.target.value) || 0;
                  const discount = form.originalPrice > 0 && price < form.originalPrice
                    ? Math.round(((form.originalPrice - price) / form.originalPrice) * 100)
                    : 0;
                  setForm({ ...form, price, discount });
                }}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Cost ($) <span className="text-xs text-muted/60">— admin only</span></label>
              <input
                type="number"
                step="0.01"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Discount (%)</label>
              <input
                type="number"
                value={form.discount}
                readOnly
                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-muted cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Server</label>
              <input
                type="text"
                value={form.server}
                onChange={(e) => setForm({ ...form, server: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                placeholder="e.g. NA, EU, Asia"
              />
            </div>
            <ImageManager
              images={form.images}
              onChange={(images) => setForm({ ...form, images })}
            />
            <div className="md:col-span-2">
              <label className="block text-sm text-muted mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-primary"
                />
                Featured
              </label>
            </div>

            {/* Game Account Details - Collapsible */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => setShowGameDetails(!showGameDetails)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-3"
              >
                <Gamepad2 size={16} />
                Game Account Details
                <ChevronDown size={14} className={`transition-transform ${showGameDetails ? 'rotate-180' : ''}`} />
              </button>

              {showGameDetails && (
                <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-muted mb-1">Account Code</label>
                      <input
                        type="text"
                        value={form.accountCode}
                        onChange={(e) => setForm({ ...form, accountCode: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                        placeholder="e.g. ACC-12345"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-1">Account Type</label>
                      <input
                        type="text"
                        value={form.accountType}
                        onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                        placeholder="e.g. Garena, Google"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-1">Rank</label>
                      <input
                        type="text"
                        value={form.rank}
                        onChange={(e) => setForm({ ...form, rank: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                        placeholder="e.g. Diamond, Heroic"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-1">Account Login <span className="text-xs text-muted/60">— hidden from public</span></label>
                      <input
                        type="text"
                        value={form.accountLogin}
                        onChange={(e) => setForm({ ...form, accountLogin: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                        placeholder="e.g. user@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-1">Account Password <span className="text-xs text-muted/60">— hidden from public</span></label>
                      <input
                        type="text"
                        value={form.accountPassword}
                        onChange={(e) => setForm({ ...form, accountPassword: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                        placeholder="e.g. p@ssw0rd"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-1">Level</label>
                      <input
                        type="number"
                        value={form.level}
                        onChange={(e) => setForm({ ...form, level: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                        placeholder="e.g. 72"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-1">Game Coins</label>
                      <input
                        type="number"
                        value={form.gameCoins}
                        onChange={(e) => setForm({ ...form, gameCoins: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                        placeholder="e.g. 15000"
                      />
                    </div>
                  </div>

                  {/* Weapon Skins */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-muted font-medium">Weapon Skins</label>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, weaponSkins: [...form.weaponSkins, { weaponName: '', skinName: '', tier: '' }] })}
                        className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Weapon Skin
                      </button>
                    </div>
                    {form.weaponSkins.map((ws, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={ws.weaponName}
                          onChange={(e) => {
                            const updated = [...form.weaponSkins];
                            updated[i] = { ...updated[i], weaponName: e.target.value };
                            setForm({ ...form, weaponSkins: updated });
                          }}
                          className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                          placeholder="Weapon"
                        />
                        <input
                          type="text"
                          value={ws.skinName}
                          onChange={(e) => {
                            const updated = [...form.weaponSkins];
                            updated[i] = { ...updated[i], skinName: e.target.value };
                            setForm({ ...form, weaponSkins: updated });
                          }}
                          className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                          placeholder="Skin Name"
                        />
                        <input
                          type="text"
                          value={ws.tier}
                          onChange={(e) => {
                            const updated = [...form.weaponSkins];
                            updated[i] = { ...updated[i], tier: e.target.value };
                            setForm({ ...form, weaponSkins: updated });
                          }}
                          className="w-28 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                          placeholder="Tier"
                        />
                        <input
                          type="text"
                          value={ws.image || ''}
                          onChange={(e) => {
                            const updated = [...form.weaponSkins];
                            updated[i] = { ...updated[i], image: e.target.value };
                            setForm({ ...form, weaponSkins: updated });
                          }}
                          className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                          placeholder="Image URL (optional)"
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, weaponSkins: form.weaponSkins.filter((_, j) => j !== i) })}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Character Skins */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-muted font-medium">Character Skins</label>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, characterSkins: [...form.characterSkins, { characterName: '', rarity: '' }] })}
                        className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Character Skin
                      </button>
                    </div>
                    {form.characterSkins.map((cs, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={cs.characterName}
                          onChange={(e) => {
                            const updated = [...form.characterSkins];
                            updated[i] = { ...updated[i], characterName: e.target.value };
                            setForm({ ...form, characterSkins: updated });
                          }}
                          className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                          placeholder="Character Name"
                        />
                        <input
                          type="text"
                          value={cs.rarity || ''}
                          onChange={(e) => {
                            const updated = [...form.characterSkins];
                            updated[i] = { ...updated[i], rarity: e.target.value };
                            setForm({ ...form, characterSkins: updated });
                          }}
                          className="w-32 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                          placeholder="Rarity"
                        />
                        <input
                          type="text"
                          value={cs.image || ''}
                          onChange={(e) => {
                            const updated = [...form.characterSkins];
                            updated[i] = { ...updated[i], image: e.target.value };
                            setForm({ ...form, characterSkins: updated });
                          }}
                          className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                          placeholder="Image URL (optional)"
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, characterSkins: form.characterSkins.filter((_, j) => j !== i) })}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                {editing ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-card border border-[#2a2a2a] rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-card border border-[#2a2a2a] rounded-xl pl-9 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowBulkMenu(!showBulkMenu)}
                className="bg-accent/15 border border-accent/30 text-accent rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-accent/25 transition-colors"
              >
                Actions ({selectedIds.length})
                <ChevronDown size={14} />
              </button>
              {showBulkMenu && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-[#2a2a2a] rounded-xl shadow-xl z-20 py-1 min-w-[180px]">
                  <button
                    onClick={() => setShowBulkMenu(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors flex items-center gap-2"
                  >
                    <Star size={14} className="text-gold" />
                    Mark as Featured
                  </button>
                  <button
                    onClick={() => setShowBulkMenu(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors flex items-center gap-2"
                  >
                    <Star size={14} className="text-muted" />
                    Unmark Featured
                  </button>
                  <div className="border-t border-[#2a2a2a] my-1" />
                  <button
                    onClick={() => setShowBulkMenu(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete Selected
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-muted text-xs mb-3">
        Showing {paginatedProducts.length} of {filteredProducts.length} products
      </p>

      {/* Products Table */}
      <div className="bg-card rounded-xl border border-[#2a2a2a] overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-primary cursor-pointer"
                  />
                </th>
                <th className="text-left p-4 text-muted font-medium">Product</th>
                <th className="text-left p-4 text-muted font-medium">Category</th>
                <th className="text-left p-4 text-muted font-medium">Price</th>
                <th className="text-left p-4 text-muted font-medium">Stock</th>
                <th className="text-center p-4 text-muted font-medium">Featured</th>
                <th className="text-left p-4 text-muted font-medium">Status</th>
                <th className="text-right p-4 text-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product._id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product._id)}
                      onChange={() => toggleSelect(product._id)}
                      className="accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#2a2a2a] flex-shrink-0">
                        <Image
                          src={product.images?.[0] || PLACEHOLDER_IMG}
                          alt={product.title}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="text-white font-medium truncate max-w-[200px]">{product.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted">{product.category}</td>
                  <td className="p-4 text-primary font-medium">{formatPrice(product.price)}</td>
                  <td className="p-4 text-white">{product.stock}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleFeatured(product)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        product.featured
                          ? 'text-gold hover:bg-gold/10'
                          : 'text-[#333] hover:text-muted hover:bg-[#2a2a2a]'
                      }`}
                    >
                      <Star size={18} fill={product.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      product.status === 'sold_out' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="text-muted hover:text-white p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="text-muted hover:text-red-400 p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted">
                    {searchQuery || categoryFilter !== 'all'
                      ? 'No products match your search or filter.'
                      : 'No products yet. Click "Add Product" to create one.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-card border border-[#2a2a2a] text-muted hover:text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-card border border-[#2a2a2a] text-muted hover:text-white hover:bg-[#2a2a2a]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-card border border-[#2a2a2a] text-muted hover:text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
