interface FooterProps {
  completedCount: number;
  onClearCompleted: () => void;
}

export function Footer({ completedCount, onClearCompleted }: FooterProps) {
  return (
    <div className="mt-auto pt-8 space-y-3">
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="w-full py-3 rounded-2xl text-xs font-semibold text-red-400 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 transition-all"
        >
          🗑 Clear Completed ({completedCount})
        </button>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Made with <span className="text-red-400 animate-pulse">❤️</span> by{" "}
          <a
            href="https://github.com/mohammad-2012"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors hover:underline font-medium"
          >
            Mohammad
          </a>
        </p>
      </div>
    </div>
  );
}
