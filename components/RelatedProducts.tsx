"use client";
import { useState, useEffect } from 'react';
import { Package, ArrowRight } from 'lucide-react';

interface RelatedProduct {
  _id: string;
  name: string;
  category: string;
  imageUrl: string;
  tags?: string[];
  colors?: string[];
  brand?: string;
  similarity?: number;
}

interface RelatedProductsProps {
  productId: string;
  limit?: number;
}

export default function RelatedProducts({ productId, limit = 6 }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!productId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/related-products?id=${productId}&limit=${limit}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch related products');

        setRelatedProducts(data.relatedProducts || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load related products');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, limit]);

  if (loading) {
    return (
      <div className="rounded-3xl p-[1.5px] bg-gradient-to-r from-rose-400 via-indigo-400 to-emerald-400 shadow-lg">
        <div className="relative rounded-[calc(theme(borderRadius.3xl)-2px)] border border-white/40 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
          {/* ambient blobs */}
          <div className="pointer-events-none absolute -top-10 -left-8 h-28 w-28 rounded-full bg-gradient-to-tr from-rose-300/40 via-fuchsia-300/30 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-300/30 via-cyan-300/30 to-transparent blur-3xl" />

          <div className="flex items-center gap-3 mb-5 relative z-10">
            <span className="inline-grid h-9 w-9 place-items-center rounded-xl border border-white/60 bg-white/80 shadow-sm backdrop-blur">
              <Package className="h-5 w-5 text-indigo-600" />
            </span>
            <h3 className="text-lg font-extrabold">
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#0f172a,#334155)] dark:bg-[linear-gradient(90deg,#e2e8f0,#94a3b8)]">
                You might also like
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            {/* conic spinner */}
            <div className="relative h-6 w-6">
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  background:
                    'conic-gradient(#f43f5e,#a855f7,#6366f1,#06b6d4,#22c55e,#f59e0b,#f43f5e)',
                  mask:
                    'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)',
                  WebkitMask:
                    'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)',
                  animationDuration: '1.1s',
                }}
              />
              <div className="absolute inset-1 rounded-full bg-white/80 dark:bg-slate-800/70" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Discovering similar products...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl p-[1.5px] bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 shadow-lg">
        <div className="relative rounded-[calc(theme(borderRadius.3xl)-2px)] border border-white/40 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-grid h-9 w-9 place-items-center rounded-xl border border-white/60 bg-white/80 shadow-sm backdrop-blur">
              <Package className="h-5 w-5 text-rose-600" />
            </span>
            <h3 className="text-lg font-extrabold">
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#0f172a,#334155)] dark:bg-[linear-gradient(90deg,#e2e8f0,#94a3b8)]">
                Related Products
              </span>
            </h3>
          </div>

          <div className="rounded-xl border border-rose-200/70 bg-rose-50/90 p-4 shadow-sm dark:border-rose-900/30 dark:bg-rose-950/40">
            <p className="text-sm font-semibold text-rose-800 dark:text-rose-200">
              Unable to load suggestions
            </p>
            <p className="mt-0.5 text-xs text-rose-700/90 dark:text-rose-300/90">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <div className="rounded-3xl p-[1.5px] bg-gradient-to-r from-slate-300 via-indigo-300 to-cyan-300 shadow-lg">
        <div className="relative rounded-[calc(theme(borderRadius.3xl)-2px)] border border-white/40 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-grid h-9 w-9 place-items-center rounded-xl border border-white/60 bg-white/80 shadow-sm backdrop-blur">
              <Package className="h-5 w-5 text-slate-600" />
            </span>
            <h3 className="text-lg font-extrabold">
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#0f172a,#334155)] dark:bg-[linear-gradient(90deg,#e2e8f0,#94a3b8)]">
                Related Products
              </span>
            </h3>
          </div>

          <div className="text-center py-6">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-white/70 shadow-sm backdrop-blur">
              <Package className="h-6 w-6 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">
              No similar products found yet
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Try uploading more products to build connections!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-rose-400 via-indigo-400 to-emerald-400 shadow-lg overflow-hidden">
      <div className="relative rounded-[calc(theme(borderRadius.3xl)-2px)] border border-white/40 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
        {/* ambient blobs */}
        <div className="pointer-events-none absolute -top-12 -right-10 h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-300/30 via-cyan-300/30 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-gradient-to-tr from-rose-300/40 via-fuchsia-300/30 to-transparent blur-3xl" />

        <div className="relative z-10 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-grid h-9 w-9 place-items-center rounded-xl border border-white/60 bg-white/80 shadow-sm backdrop-blur">
              <Package className="h-5 w-5 text-indigo-600" />
            </span>
            <h3 className="text-lg font-extrabold">
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#0f172a,#334155)] dark:bg-[linear-gradient(90deg,#e2e8f0,#94a3b8)]">
                Similar Items
              </span>
              <span className="ml-2 align-middle text-sm font-medium text-slate-600 dark:text-slate-400">
                ({relatedProducts.length} found)
              </span>
            </h3>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {relatedProducts.map((product, index) => {
            const frameGrad =
              product.similarity && product.similarity > 0.8
                ? 'from-emerald-400 via-lime-400 to-amber-400'
                : product.similarity && product.similarity > 0.6
                ? 'from-indigo-400 via-sky-400 to-cyan-400'
                : 'from-rose-400 via-fuchsia-400 to-purple-400';

            const badgeGrad =
              product.similarity && product.similarity > 0.8
                ? 'from-emerald-500 to-teal-600'
                : product.similarity && product.similarity > 0.6
                ? 'from-indigo-500 to-violet-600'
                : 'from-slate-600 to-gray-700';

            return (
              <div key={product._id} className="group cursor-pointer">
                <div className={`relative rounded-2xl p-[1.5px] bg-gradient-to-br ${frameGrad} shadow-md transition-all group-hover:shadow-lg`}>
                  <div className="relative overflow-hidden rounded-[calc(theme(borderRadius.2xl)-2px)] border border-white/50 bg-white/75 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-24 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />

                    {/* vignette + overlay */}
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/25 to-transparent" />
                    {/* bottom accent bar */}
                    <div
                      className="absolute bottom-0 left-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500 transition-transform duration-500 group-hover:scale-x-100"
                      style={{ transitionDelay: `${index * 40}ms` }}
                    />

                    {/* similarity badge */}
                    {typeof product.similarity === 'number' && (
                      <div className={`absolute top-1.5 right-1.5 rounded-full bg-gradient-to-r ${badgeGrad} px-2 py-0.5 text-xs font-bold text-white shadow-lg`}>
                        {Math.round(product.similarity * 100)}%
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <h4
                    className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:via-indigo-500 group-hover:to-emerald-500 dark:text-slate-100"
                    title={product.name}
                  >
                    {product.name}
                  </h4>

                  <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                    {product.category}
                  </p>

                  {product.brand && (
                    <p className="w-fit rounded-md border border-white/60 bg-white/70 px-2 py-0.5 text-xs font-medium text-slate-800 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-100">
                      {product.brand}
                    </p>
                  )}

                  {product.colors && product.colors.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {product.colors.slice(0, 3).map((color, colorIndex) => (
                        <span
                          key={colorIndex}
                          className="h-3 w-3 rounded-full border border-white shadow-sm ring-1 ring-slate-200"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <span className="self-center text-xs text-slate-400">
                          +{product.colors.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
