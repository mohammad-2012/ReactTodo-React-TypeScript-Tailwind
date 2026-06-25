interface HeaderProps {
  dark: boolean;
  toggleTheme: () => void;
  completedCount: number;
  totalCount: number;
}

export function Header({
  dark,
  toggleTheme,
  completedCount,
  totalCount,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          ✦ تودولیست
        </h1>
        <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">
          {completedCount} از {totalCount} کار انجام شد
        </p>
      </div>
      <button
        onClick={toggleTheme}
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 active:scale-95 glass"
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
