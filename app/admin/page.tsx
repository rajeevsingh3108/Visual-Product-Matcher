"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  id?: string;
  name: string;
  category: string;
  description?: string;
  brand?: string;
  tags?: string[];
  colors?: string[];
  imageUrl: string;
  relatedProducts?: Product[];
  createdAt: string;
}

export default function AdminPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok) {
          setItems(data.products || []);
          const uniqueCategories = Array.from(
            new Set((data.products || []).map((p: Product) => p.category))
          ).sort() as string[];
          setCategories(uniqueCategories);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item? This will also remove the uploaded file.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(p => p._id !== id));
      } else {
        const data = await res.json();
        alert(`Failed to delete: ${data.error || 'Unknown error'}`);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = selectedCategory
    ? items.filter(item =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    : items;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* background: colorful gradient + darker dots (same as homepage) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 dark:from-indigo-900 dark:via-purple-900 dark:to-slate-900" />
        <div className="absolute inset-0 opacity-60 [mask-image:radial-gradient(transparent_0,black_70%)]">
          <div className="h-full w-full bg-[radial-gradient(rgba(17,24,39,0.15)_1px,transparent_1.5px)] bg-[length:18px_18px] dark:bg-[radial-gradient(rgba(226,232,240,0.15)_1px,transparent_1.5px)]" />
        </div>
        <div className="absolute left-10 right-10 top-[72px] h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
        <div className="absolute left-16 right-16 bottom-10 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-rose-300/35 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-300/35 to-transparent" />
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        {/* header bar */}
        <div className="mb-8">
          <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-rose-400 via-indigo-400 to-emerald-400 shadow-lg">
            <div className="flex items-center justify-between rounded-[calc(theme(borderRadius.2xl)-2px)] border border-white/40 bg-white/70 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#0f172a,#334155)] dark:bg-[linear-gradient(90deg,#e2e8f0,#94a3b8)]">
                  Admin Dashboard
                </span>
              </h1>
              <Link
                href="/"
                className="group relative inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/70 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-100"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 dark:from-indigo-400 dark:via-sky-400 dark:to-emerald-400">
                  Back to Home
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-indigo-300/40" />
              </Link>
            </div>
          </div>
        </div>

        {/* FROSTED SECTION: keeps area filled even when few/no products */}
        <section className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
          {/* info banner */}
          <div className="mb-6">
            <div className="rounded-3xl p-[1.5px] bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-400 shadow-lg">
              <div className="rounded-[calc(theme(borderRadius.3xl)-2px)] border border-white/50 bg-white/75 p-4 text-sm text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
                New items can only be added after analyzing an image on the Home page. Use
                <span className="mx-1 inline-block rounded-md border border-white/60 bg-white/70 px-2 py-0.5 font-semibold text-slate-800 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-100">
                  Analyze Image
                </span>
                → Save to Catalog.
              </div>
            </div>
          </div>

          {/* category filter */}
          <div className="mb-6">
            <div className="rounded-3xl p-[1.5px] bg-gradient-to-r from-rose-400 via-fuchsia-400 to-purple-400 shadow-lg">
              <div className="flex flex-wrap items-center gap-4 rounded-[calc(theme(borderRadius.3xl)-2px)] border border-white/50 bg-white/75 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Filter by Category:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-sm rounded-xl border border-white/60 bg-white/80 px-3 py-1.5 text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-indigo-300/50 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-100"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {filteredItems.length} of {items.length} items
                </span>
              </div>
            </div>
          </div>

          {/* list header */}
          <div className="mt-2 mb-3">
            <h2 className="text-lg md:text-xl font-extrabold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500">
                All Products ({items.length})
              </span>
            </h2>
          </div>

          {/* loading / empty */}
          {loading && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/50 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
              <span className="relative inline-block h-5 w-5">
                <span
                  className="absolute inset-0 animate-spin rounded-full"
                  style={{
                    background:
                      'conic-gradient(#f43f5e,#a855f7,#6366f1,#06b6d4,#22c55e,#f59e0b,#f43f5e)',
                    mask:
                      'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)',
                    WebkitMask:
                      'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)',
                    animationDuration: '1.1s',
                  }}
                />
              </span>
              <div className="text-slate-700 dark:text-slate-300">Loading...</div>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="mb-6 rounded-2xl border border-white/50 bg-white/75 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-slate-700 dark:text-slate-300">No products in database yet.</p>
            </div>
          )}

          {/* grid (kept minimum height so section looks filled) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 min-h-[420px]">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="relative h-full rounded-3xl p-[1.5px] bg-gradient-to-br from-rose-400 via-indigo-400 to-emerald-400 shadow-lg"
              >
                {/* inner card fills full height */}
                <div className="h-full overflow-hidden rounded-[calc(theme(borderRadius.3xl)-2px)] border border-white/50 bg-white/75 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 flex flex-col">
                  
                  {/* image (fixed height) */}
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className={`absolute right-2 top-2 rounded-lg px-3 py-1 text-sm font-semibold text-white shadow-lg transition-all
                        ${
                          deletingId === item._id
                            ? 'cursor-not-allowed bg-slate-400'
                            : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700'
                        }`}
                    >
                      {deletingId === item._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>

                  {/* content fills remaining space */}
                  <div className="flex-1 p-4">
                    <div className="mb-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      {item.name}
                    </div>

                    <div className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">Category:</span> {item.category}
                    </div>

                    {item.brand && (
                      <div className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Brand:</span> {item.brand}
                      </div>
                    )}

                    {item.description && (
                      <div className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Description:</span> {item.description}
                      </div>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Tags:
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {item.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.colors && item.colors.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Colors:
                        </span>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          {item.colors.map((color, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                            >
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.relatedProducts && item.relatedProducts.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Related Products ({item.relatedProducts.length}):
                        </span>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {item.relatedProducts.slice(0, 3).map((related, index) => (
                            <div key={index}>• {related.name}</div>
                          ))}
                          {item.relatedProducts.length > 3 && (
                            <div>... and {item.relatedProducts.length - 3} more</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* footer pinned to bottom */}
                  <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-4 text-xs text-slate-400">
                    <div className="truncate">ID: {item._id}</div>
                    <div className="text-right">
                      Created: {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
