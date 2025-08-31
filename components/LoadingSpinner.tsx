export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-5">
      <div className="relative h-12 w-12">
        {/* base soft ring */}
        <div className="absolute inset-0 rounded-full bg-white/60 shadow-inner ring-1 ring-black/5 dark:bg-slate-800/50 dark:ring-white/5" />

        {/* colorful outer spinner */}
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            background:
              'conic-gradient(#f43f5e,#a855f7,#6366f1,#06b6d4,#22c55e,#f59e0b,#f43f5e)',
            mask:
              'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
            animationDuration: '1.1s',
          }}
        />

        {/* inner counter-rotating ring */}
        <div
          className="absolute inset-1 rounded-full animate-spin"
          style={{
            background:
              'conic-gradient(#a855f7,#22c55e,#06b6d4,#f43f5e,#f59e0b,#6366f1,#a855f7)',
            mask:
              'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
            animationDuration: '1.6s',
            animationDirection: 'reverse',
            opacity: 0.85,
          }}
        />
      </div>

      <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500 dark:from-rose-400 dark:via-indigo-400 dark:to-emerald-400">
        Finding your matches...
      </p>
    </div>
  );
}
