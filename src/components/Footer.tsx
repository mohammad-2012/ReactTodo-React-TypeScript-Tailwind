interface FooterProps {
  completedCount: number;
  onClearCompleted: () => void;
}

export function Footer({ completedCount, onClearCompleted }: FooterProps) {
  return (
    <div className="mt-8 space-y-3">
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="w-full py-3 rounded-2xl text-xs font-semibold text-red-400 hover:text-red-500 bg-red-50/30 hover:bg-red-100/30 dark:bg-red-900/10 dark:hover:bg-red-900/20 transition-all duration-300"
        >
          🗑 حذف همه انجام‌شده‌ها ({completedCount})
        </button>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          ساخته شده با <span className="text-red-400 animate-pulse">❤️</span>{" "}
          توسط تودولیست
        </p>
      </div>
    </div>
  );
}
