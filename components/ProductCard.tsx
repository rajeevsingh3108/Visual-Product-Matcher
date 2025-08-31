import { motion } from 'framer-motion';
import { Tag, Star, Heart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  similarity: number;
  brand?: string;
  description?: string;
  tags?: string[];
  colors?: string[];
  relatedProducts?: any[];
}

export default function ProductCard({
  id,
  name,
  category,
  imageUrl,
  similarity,
  brand,
  description,
  tags,
  colors,
  relatedProducts,
}: ProductCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const isHighMatch = similarity > 0.8;
  const isGoodMatch = similarity > 0.6;

  const accent = isHighMatch
    ? {
        frame: 'from-emerald-400 via-lime-400 to-amber-400',
        badge: 'from-emerald-500 to-teal-600',
        chip: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        corner: 'bg-emerald-100',
        halo: 'bg-emerald-400/70',
        glow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.65)_inset]',
      }
    : isGoodMatch
    ? {
        frame: 'from-indigo-400 via-sky-400 to-cyan-400',
        badge: 'from-indigo-500 to-violet-600',
        chip: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
        corner: 'bg-indigo-100',
        halo: 'bg-indigo-400/70',
        glow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.65)_inset]',
      }
    : {
        frame: 'from-rose-400 via-fuchsia-400 to-purple-400',
        badge: 'from-slate-600 to-gray-700',
        chip: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
        corner: 'bg-slate-100',
        halo: 'bg-slate-400/60',
        glow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.55)_inset]',
      };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -8,
        scale: 1.02,
        rotate: -0.2,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      className={`relative group rounded-3xl p-[1.5px] bg-gradient-to-br ${accent.frame} shadow-lg transition-all`}
    >
      <div className="bg-white/75 dark:bg-slate-900/60 rounded-[calc(theme(borderRadius.3xl)-2px)] border border-white/50 dark:border-white/10 backdrop-blur-xl p-5 flex flex-col gap-3 overflow-hidden">
        {/* ambient glow + corner ribbon (decorative) */}
        <div aria-hidden className={`absolute -top-6 -right-6 h-24 w-24 rounded-full blur-3xl opacity-40 ${accent.halo}`} />
        <div aria-hidden className={`absolute top-0 right-0 w-16 h-16 rotate-45 translate-x-8 -translate-y-8 ${accent.corner} opacity-60`} />

        {/* media */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-xl bg-slate-50">
            <img
              src={imageUrl}
              alt={name}
              className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            {/* vignette + shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute -inset-x-10 -top-1/2 h-full bg-white/20 rotate-45 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-60" />
          </div>

          {/* match % */}
          <div className={`absolute -top-2 -right-2 rotate-12 rounded-full px-2.5 py-1 text-xs font-extrabold text-white shadow-lg bg-gradient-to-r ${accent.badge}`}>
            {Math.round(similarity * 100)}%
          </div>

          {/* favorite (visual only) */}
          <div className="absolute top-2 left-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Heart className="w-4 h-4 text-white drop-shadow-lg hover:fill-red-500 hover:text-red-500 cursor-pointer" />
          </div>
        </div>

        {/* content */}
        <div className="flex flex-col gap-2">
          <div>
            <h3
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:via-indigo-500 group-hover:to-emerald-500 transition-colors"
              title={name}
            >
              {name}
            </h3>

            <div className="mt-1 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">{category}</span>
              {isHighMatch && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 drop-shadow-sm" />}
            </div>
          </div>

          {brand && (
            <div className="w-fit rounded-lg border border-white/60 bg-white/70 px-2 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-100">
              {brand}
            </div>
          )}

          {description && (
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2" title={description}>
              {description}
            </p>
          )}
        </div>

        {/* tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm transition-colors ${accent.chip}`}>
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="self-center text-xs font-medium text-slate-400">+{tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* colors */}
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Colors:</span>
            <div className="flex gap-1.5">
              {colors.slice(0, 4).map((color, index) => (
                <div key={index} className="relative group/color">
                  <span
                    className={`block h-5 w-5 rounded-full border-2 border-white ring-1 ring-slate-200 transition-transform hover:scale-110 cursor-pointer ${accent.glow}`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                  <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover/color:opacity-100">
                    {color}
                  </div>
                </div>
              ))}
              {colors.length > 4 && (
                <span className="ml-1 self-center text-xs font-medium text-slate-400">+{colors.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* related */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="flex items-center gap-2 border-t border-slate-100 pt-2 dark:border-slate-800/60">
            <div className="flex -space-x-1">
              {[...Array(Math.min(3, relatedProducts.length))].map((_, i) => (
                <div key={i} className="h-4 w-4 rounded-full border border-white shadow-sm bg-gradient-to-br from-rose-400 via-indigo-400 to-emerald-400" />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {relatedProducts.length} similar {relatedProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
