// ErrorMessage.tsx
import { AlertTriangle } from 'lucide-react';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="relative flex items-start gap-3 rounded-2xl border border-red-200/60 border-l-4 border-l-red-400 bg-gradient-to-r from-red-50/90 to-rose-50/70 px-5 py-4 text-red-800 shadow-sm transition-shadow duration-200 hover:shadow-md backdrop-blur-sm dark:border-red-900/40 dark:border-l-red-700 dark:from-red-950/60 dark:to-rose-950/40 dark:text-red-200">
      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-300" />
      <div className="space-y-0.5">
        <p className="text-sm font-semibold leading-tight tracking-tight">Oops! Something went wrong</p>
        <p className="text-sm leading-5 text-red-700/90 dark:text-red-300/90">{message}</p>
      </div>
      <div className="pointer-events-none absolute top-2 right-2 h-1 w-1 rounded-full bg-red-400/70 dark:bg-red-500/60" />
    </div>
  );
}
