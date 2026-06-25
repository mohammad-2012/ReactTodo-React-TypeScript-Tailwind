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
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          ✦ TodoList
        </h1>
        <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">
          {completedCount} of {totalCount} tasks completed
        </p>
      </div>
      <button
        onClick={toggleTheme}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95 ${
          dark
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-white hover:bg-gray-100 shadow-sm border border-gray-200"
        }`}
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
