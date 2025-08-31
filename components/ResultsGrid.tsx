import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

interface Product {
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

type Props = {
  products: Product[];
};

export default function ResultsGrid({ products }: Props) {
  if (!products.length) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="
        relative isolate grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
        rounded-3xl p-4
        bg-white/60 border border-white/40 backdrop-blur-xl
        dark:bg-slate-900/50 dark:border-white/10
      "
    >
      {/* ambient gradient frame (soft, behind content) */}
      <div className="pointer-events-none absolute -z-10 inset-0 rounded-3xl p-[1.5px]">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-rose-300/30 via-indigo-300/30 to-emerald-300/30 blur-xl" />
      </div>

      {/* dotted pattern layer */}
      <div className="pointer-events-none absolute -z-10 inset-0 rounded-3xl opacity-40 [mask-image:radial-gradient(transparent_0,black_60%)]">
        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(rgba(255,255,255,0.45)_1px,transparent_1.6px)] bg-[length:16px_16px] dark:bg-[radial-gradient(rgba(148,163,184,0.25)_1px,transparent_1.6px)]" />
      </div>

      {/* light beams / blobs */}
      <div className="pointer-events-none absolute -z-10 -top-10 -left-12 h-40 w-40 rounded-full bg-gradient-to-tr from-rose-300/40 via-fuchsia-300/30 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -z-10 -bottom-12 -right-10 h-44 w-44 rounded-full bg-gradient-to-tr from-indigo-300/30 via-cyan-300/30 to-transparent blur-3xl" />

      {/* fine accent lines */}
      <div className="pointer-events-none absolute -z-10 left-10 right-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
      <div className="pointer-events-none absolute -z-10 left-14 right-14 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />

      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </motion.div>
  );
}
