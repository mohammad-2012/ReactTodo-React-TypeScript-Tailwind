interface ProgressBarProps {
  progress: number;
  dark: boolean; // اضافه کردن dark به props
}

export function ProgressBar({ progress, dark }: ProgressBarProps) {
  return (
    <div
      className={`rounded-2xl p-4 mb-6 ${
        dark ? "bg-gray-900" : "bg-white shadow-sm border border-gray-100"
      }`}
    >
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-2">
        <span>Overall Progress</span>
        <span className="font-bold text-indigo-500 dark:text-indigo-400">
          {progress}%
        </span>
      </div>
      <div
        className={`h-2.5 rounded-full overflow-hidden ${
          dark ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
