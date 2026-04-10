import { motion } from "framer-motion";
import { Moon } from "lucide-react";

interface MoonPhaseProps {
  phase: number; // 0 to 1
}

export function MoonPhase({ phase }: MoonPhaseProps) {
  const getPhaseName = (p: number) => {
    if (p === 0 || p === 1) return "New Moon";
    if (p > 0 && p < 0.25) return "Waxing Crescent";
    if (p === 0.25) return "First Quarter";
    if (p > 0.25 && p < 0.5) return "Waxing Gibbous";
    if (p === 0.5) return "Full Moon";
    if (p > 0.5 && p < 0.75) return "Waning Gibbous";
    if (p === 0.75) return "Last Quarter";
    return "Waning Crescent";
  };

  const name = getPhaseName(phase);

  return (
    <div className="flex items-center gap-4 rounded-3xl bg-black/5 p-4 dark:bg-white/5 transition-all hover:bg-black/10 dark:hover:bg-white/10">
      <div className="relative h-12 w-12 shrink-0">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/20" />
        
        {/* Simple Moon Visualization */}
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 flex items-center justify-center rounded-full bg-linear-to-br from-slate-400 to-slate-600 shadow-lg"
        >
          {/* Shadow layer to represent phase */}
          <div 
            className="absolute h-full w-full rounded-full bg-slate-900/80"
            style={{
              clipPath: phase <= 0.5 
                ? `inset(0 0 0 ${phase * 200}%)` 
                : `inset(0 ${(1 - phase) * 200}% 0 0)`
            }}
          />
          <Moon className="h-4 w-4 text-white/20" />
        </motion.div>
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Lunar Phase</p>
        <p className="truncate text-sm font-bold">{name}</p>
        <p className="text-[10px] text-slate-500">{(phase * 100).toFixed(0)}% Illuminated</p>
      </div>
    </div>
  );
}
