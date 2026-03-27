interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50/90 p-6 text-rose-900 shadow-lg shadow-rose-500/5 backdrop-blur dark:border-rose-500/20 dark:bg-rose-950/30 dark:text-rose-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500 dark:text-rose-300">
            Request failed
          </p>
          <p className="mt-2 text-sm leading-6">{message}</p>
        </div>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
}
