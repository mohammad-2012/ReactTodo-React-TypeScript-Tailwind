interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="glass rounded-2xl p-4 mb-6">
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-2">
        <span>Overall Progress</span>
        <span className="font-bold text-indigo-400">{progress}%</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden bg-gray-200/50 dark:bg-gray-700/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
