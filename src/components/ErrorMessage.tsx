import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="zenith-glass zenith-card max-w-md space-y-6 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight">Cosmic Interference</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {message || "We encountered an atmospheric disturbance while fetching your data."}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 active:scale-95"
          >
            <RefreshCcw className="h-4 w-4" />
            Recalibrate Sensors
          </button>
        )}
      </motion.div>
    </div>
  );
}
