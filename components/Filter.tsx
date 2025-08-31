import { Filter as FilterIcon, Sliders } from 'lucide-react';

type Props = {
  value: number;
  setValue: (v: number) => void;
};

export default function Filter({ value, setValue }: Props) {
  const label = value < 0.3 ? 'Loose' : value < 0.7 ? 'Good' : 'Precise';

  const accent =
    value < 0.3
      ? {
          // warm playful
          borderGrad: 'from-rose-500 via-fuchsia-500 to-purple-600',
          cardGrad: 'from-rose-50 via-fuchsia-50 to-purple-50',
          trackGrad: 'from-rose-500 via-fuchsia-500 to-purple-600',
          icon: 'text-fuchsia-600',
          badge: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
          dot: 'bg-rose-400/80',
          glow: 'rgba(244,63,94,0.45)',
        }
      : value < 0.7
      ? {
          // cool confident
          borderGrad: 'from-indigo-500 via-sky-500 to-cyan-500',
          cardGrad: 'from-indigo-50 via-sky-50 to-cyan-50',
          trackGrad: 'from-indigo-500 via-sky-500 to-cyan-500',
          icon: 'text-indigo-600',
          badge: 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200',
          dot: 'bg-indigo-400/80',
          glow: 'rgba(99,102,241,0.45)',
        }
      : {
          // crisp success
          borderGrad: 'from-emerald-500 via-lime-500 to-amber-500',
          cardGrad: 'from-emerald-50 via-lime-50 to-amber-50',
          trackGrad: 'from-emerald-500 via-lime-500 to-amber-500',
          icon: 'text-emerald-600',
          badge: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
          dot: 'bg-emerald-400/80',
          glow: 'rgba(16,185,129,0.45)',
        };

  return (
    <div className={`relative rounded-3xl p-[1.5px] bg-gradient-to-r ${accent.borderGrad} shadow-lg`}>
      <div
        className={[
          'group relative flex items-center gap-6 rounded-[calc(theme(borderRadius.3xl)-2px)]',
          'border border-white/40 bg-gradient-to-br',
          accent.cardGrad,
          'px-6 py-6 backdrop-blur-xl',
          'dark:bg-slate-900/60 dark:border-white/10',
        ].join(' ')}
      >
        {/* decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-6 -left-6 h-24 w-24 rounded-full bg-gradient-to-tr from-white/40 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-gradient-to-tr from-white/30 to-transparent blur-3xl" />

        {/* Header */}
        <div className="flex min-w-fit items-center gap-2">
          <span
            className={[
              'inline-grid place-items-center h-8 w-8 rounded-xl',
              'bg-white/70 backdrop-blur border border-white/50 shadow-sm',
            ].join(' ')}
          >
            <Sliders className={`h-4 w-4 ${accent.icon}`} />
          </span>
          <span className="text-sm font-semibold tracking-tight bg-clip-text text-transparent bg-[linear-gradient(90deg,#111,#475569)] dark:bg-[linear-gradient(90deg,#e2e8f0,#94a3b8)]">
            Quality Match
          </span>
        </div>

        {/* Slider + meta */}
        <div className="flex flex-1 items-center gap-5">
          {/* colorful badge */}
          <span
            className={[
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
              'shadow-sm transition-transform duration-150 group-hover:scale-[1.02]',
              accent.badge,
            ].join(' ')}
          >
            {label}
            <span className="ml-0.5 opacity-60">•</span>
            <span className="text-slate-900/90 dark:text-slate-100">{(value * 100).toFixed(0)}%</span>
          </span>

          {/* slider track */}
          <div className="relative flex-1 max-w-80 md:max-w-[520px]">
            {/* unfilled track */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-full rounded-full bg-white/60 shadow-inner ring-1 ring-black/5 dark:bg-slate-700/50" />

            {/* subtle tick marks */}
            <div className="pointer-events-none absolute inset-0 rounded-full opacity-50 [background:repeating-linear-gradient(to_right,transparent,transparent_10px,rgba(0,0,0,0.06)_10px,rgba(0,0,0,0.06)_11px)] dark:[background:repeating-linear-gradient(to_right,transparent,transparent_10px,rgba(255,255,255,0.08)_10px,rgba(255,255,255,0.08)_11px)]" />

            {/* colorful fill */}
            <div
              className={[
                'pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full',
                'bg-gradient-to-r',
                accent.trackGrad,
                'shadow-[0_0_0_1px_rgba(255,255,255,0.65)_inset]',
            ].join(' ')}
              style={{ width: `${value * 100}%` }}
            />

            {/* glow at thumb */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full blur-md opacity-80"
              style={{
                left: `${value * 100}%`,
                background: `radial-gradient(circle at center, ${accent.glow}, rgba(0,0,0,0) 60%)`,
              }}
            />

            {/* range input (actual control) */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={value}
              aria-label="Quality match threshold"
              onChange={(e) => setValue(Number(e.target.value))}
              className="
                relative z-10 w-full cursor-pointer appearance-none bg-transparent outline-none
                focus-visible:rounded focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2 dark:focus-visible:ring-white/20

                [&::-webkit-slider-runnable-track]:h-2
                [&::-webkit-slider-runnable-track]:rounded-full
                [&::-webkit-slider-runnable-track]:bg-transparent

                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white dark:[&::-webkit-slider-thumb]:bg-slate-200
                [&::-webkit-slider-thumb]:shadow-[0_1px_6px_rgba(0,0,0,0.25),0_0_0_2px_#fff]
                [&::-webkit-slider-thumb]:border
                [&::-webkit-slider-thumb]:border-white/60
                [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:active:scale-110
                [&::-webkit-slider-thumb]:cursor-pointer

                [&::-moz-range-track]:h-2
                [&::-moz-range-track]:rounded-full
                [&::-moz-range-track]:bg-transparent
                [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:w-5
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:border
                [&::-moz-range-thumb]:border-white/60
                [&::-moz-range-thumb]:bg-white dark:[&::-moz-range-thumb]:bg-slate-200
                [&::-moz-range-thumb]:shadow-[0_1px_6px_rgba(0,0,0,0.25),0_0_0_2px_#fff]
                [&::-moz-range-thumb]:transition-transform
                [&::-moz-range-thumb]:active:scale-110
                [&::-moz-range-thumb]:cursor-pointer
              "
            />

            {/* floating value pill */}
            <div
              className="pointer-events-none absolute -top-8 -translate-x-1/2 select-none"
              style={{ left: `${value * 100}%` }}
            >
              <div className="rounded-full bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                {(value * 100).toFixed(0)}%
              </div>
              <div className="mx-auto -mt-1 h-2 w-2 rotate-45 rounded-[2px] bg-slate-900/90" />
            </div>

            {/* Min / Mid / Max ticks */}
            <div className="mt-2 grid grid-cols-3 text-[10px] text-slate-600 dark:text-slate-400">
              <span>0%</span>
              <span className="text-center">50%</span>
              <span className="text-right">100%</span>
            </div>
          </div>

          {/* decorative icon */}
          <span
            className={[
              'hidden md:inline-grid place-items-center h-9 w-9 rounded-xl',
              'bg-white/70 backdrop-blur border border-white/60 shadow-sm',
            ].join(' ')}
          >
            <FilterIcon className={`h-4 w-4 ${accent.icon}`} />
          </span>
        </div>

        {/* status dot */}
        <div className={`pointer-events-none absolute right-4 top-4 h-1.5 w-1.5 rounded-full ${accent.dot}`} />
      </div>
    </div>
  );
}
