export function Loader() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/50 px-5 py-4 text-sm font-medium text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500 dark:border-slate-600 dark:border-t-sky-400" />
        Loading live weather data...
      </div>
    </div>
  );
}
