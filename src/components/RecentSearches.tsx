import type { RecentSearchItem } from "../types/weather";
import { SectionHeading } from "./SectionHeading";

interface RecentSearchesProps {
  items: RecentSearchItem[];
  onSelect: (query: string) => void;
}

export function RecentSearches({ items, onSelect }: RecentSearchesProps) {
  return (
    <aside className="rounded-[2rem] border border-white/30 bg-white/55 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/45">
      <SectionHeading
        eyebrow="Saved"
        title="Recent searches"
        subtitle="Quickly jump back into cities you checked recently."
      />

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300/70 p-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Your recent city searches will appear here.
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.query)}
              className="flex w-full items-center justify-between rounded-[1.5rem] border border-white/30 bg-white/60 px-4 py-3 text-left shadow-lg shadow-slate-900/5 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-slate-950/35 dark:hover:bg-slate-900/60"
            >
              <span>
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">{item.label}</span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(item.searchedAt)}
                </span>
              </span>
              <span className="text-slate-400 dark:text-slate-500">↗</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
