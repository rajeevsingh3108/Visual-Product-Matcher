import { Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="relative w-full px-6 md:px-8 py-4">
      {/* Gradient frame */}
      <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-rose-400 via-indigo-400 to-emerald-400 shadow-lg">
        {/* Glass bar */}
        <div className="relative flex items-center justify-between rounded-[calc(theme(borderRadius.2xl)-2px)] border border-white/40 bg-white/70 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
          {/* Ambient blobs */}
          <div className="pointer-events-none absolute -top-10 -left-8 h-28 w-28 rounded-full bg-gradient-to-tr from-rose-300/40 via-fuchsia-300/30 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-300/30 via-cyan-300/30 to-transparent blur-3xl" />

          {/* Brand */}
          <div className="flex items-center gap-3 relative">
            <div className="relative">
              <span className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-rose-400/25 via-indigo-400/25 to-emerald-400/25 blur-xl" />
              <span className="relative inline-grid h-10 w-10 place-items-center rounded-xl border border-white/60 bg-white/80 shadow-sm backdrop-blur">
                <Zap className="h-5 w-5 text-indigo-600" />
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold leading-none tracking-tight">
                <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#0f172a,#334155)] dark:bg-[linear-gradient(90deg,#e2e8f0,#94a3b8)]">
                  Visual
                </span>
                <span className="ml-1 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500">
                  Match
                </span>
              </h1>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                Smart product discovery
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="group relative inline-flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/70 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-100"
            >
              <Sparkles className="h-4 w-4 text-indigo-600 opacity-90 transition-transform group-hover:scale-110" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 dark:from-indigo-400 dark:via-sky-400 dark:to-emerald-400">
                Admin
              </span>
              <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-indigo-300/40" />
            </Link>
          </div>

          {/* Fine light beams */}
          <div className="pointer-events-none absolute left-1/4 right-1/4 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
          <div className="pointer-events-none absolute left-1/3 right-1/3 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
        </div>
      </div>
    </nav>
  );
}
