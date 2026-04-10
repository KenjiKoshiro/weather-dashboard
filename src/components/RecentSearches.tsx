import { motion, AnimatePresence } from "framer-motion";
import { RecentSearchItem } from "../types/weather";
import { MapPin, X, History } from "lucide-react";

interface RecentSearchesProps {
  items: RecentSearchItem[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export function RecentSearches({ items, onSelect, onRemove }: RecentSearchesProps) {
  if (items.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-blue-500" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent Expeditions</h3>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative"
            >
              <button
                onClick={() => onSelect(item.id)}
                className="zenith-glass flex w-full items-center gap-3 rounded-2xl p-4 pr-12 text-left transition-all hover:bg-blue-500/10 active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{item.name}</p>
                  <p className="truncate text-[10px] font-bold uppercase tracking-tighter text-slate-500">{item.country}</p>
                </div>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
