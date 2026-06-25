import { Todo, Priority } from "../types/todo";
import { PRIORITY_CONFIG } from "../constants";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
  dark: boolean;
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fa-IR");
}

export function TodoItem({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  onToggleTimer,
  onResetTimer,
  dark,
}: TodoItemProps) {
  const p = PRIORITY_CONFIG[todo.priority];
  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false;
    const due = new Date(
      todo.dueDate + (todo.dueTime ? "T" + todo.dueTime : "T23:59"),
    );
    return due < new Date();
  };
  const overdue = isOverdue();

  const timerProgress = () => {
    if (!todo.timerSeconds) return 0;
    return Math.min(100, (todo.timerElapsed / todo.timerSeconds) * 100);
  };
  const tp = timerProgress();
  const timerDone =
    todo.timerSeconds > 0 && todo.timerElapsed >= todo.timerSeconds;

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-300 group relative overflow-hidden ${
        todo.completed ? "opacity-50" : ""
      } ${
        dark
          ? "glass-dark hover:bg-gray-800/90"
          : "glass hover:bg-white/90 shadow-sm"
      }`}
    >
      <div
        className="absolute right-0 top-0 bottom-0 w-1 rounded-r-2xl"
        style={{ backgroundColor: todo.color }}
      />

      <div className="flex items-start gap-3 pr-3">
        <button
          onClick={() => onToggleComplete(todo.id)}
          className={`mt-0.5 w-6 h-6 rounded-xl flex-shrink-0 flex items-center justify-center border-2 transition-all duration-300 hover:scale-110 ${
            todo.completed
              ? "border-transparent text-white"
              : dark
                ? "border-gray-600 hover:border-indigo-400"
                : "border-gray-300 hover:border-indigo-400"
          }`}
          style={
            todo.completed
              ? {
                  backgroundColor: todo.color,
                  borderColor: todo.color,
                }
              : {}
          }
        >
          {todo.completed && <span className="text-xs">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3
              className={`font-bold text-sm leading-snug ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.title}
            </h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-xl font-semibold ${p.color} ${p.bg} ${p.darkBg}`}
              >
                {p.label}
              </span>
              {overdue && (
                <span className="text-xs px-2.5 py-0.5 rounded-xl font-semibold text-red-500 bg-red-100 dark:bg-red-900/30 animate-pulse">
                  ⚠️ دیر شده!
                </span>
              )}
            </div>
          </div>

          {todo.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
              {todo.description}
            </p>
          )}

          {(todo.dueDate || todo.dueTime) && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500">
              <span>📅</span>
              {todo.dueDate && <span>{formatDate(todo.dueDate)}</span>}
              {todo.dueTime && <span>⏰ {todo.dueTime}</span>}
            </div>
          )}

          {todo.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-2">
              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-2.5 py-0.5 rounded-xl ${
                    dark
                      ? "bg-gray-800/50 text-gray-300"
                      : "bg-gray-100/50 text-gray-500"
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {todo.timerSeconds > 0 && (
            <div className="mt-3">
              <div
                className={`h-1.5 rounded-full overflow-hidden mb-1.5 ${
                  dark ? "bg-gray-800/50" : "bg-gray-100/50"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    timerDone
                      ? "bg-green-400"
                      : "bg-gradient-to-r from-indigo-400 to-purple-400"
                  }`}
                  style={{ width: `${tp}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-bold ${
                    timerDone ? "text-green-400" : "text-indigo-400"
                  }`}
                >
                  {timerDone ? "✅ تموم شد" : formatTime(todo.timerElapsed)} /{" "}
                  {formatTime(todo.timerSeconds)}
                </span>
                <button
                  onClick={() => onToggleTimer(todo.id)}
                  disabled={timerDone}
                  className={`text-xs px-3 py-0.5 rounded-xl font-semibold transition-all disabled:opacity-30 hover:scale-105 ${
                    todo.timerRunning
                      ? "bg-red-100 text-red-500 dark:bg-red-900/30"
                      : "bg-indigo-100 text-indigo-500 dark:bg-indigo-900/30"
                  }`}
                >
                  {todo.timerRunning ? "⏸" : "▶"}
                </button>
                <button
                  onClick={() => onResetTimer(todo.id)}
                  className="text-xs px-3 py-0.5 rounded-xl font-semibold bg-gray-100/50 text-gray-500 dark:bg-gray-800/50 hover:bg-gray-200/50 transition-all hover:scale-105"
                >
                  ↺
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-3 pr-9 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => onEdit(todo)}
          className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all hover:scale-105 ${
            dark
              ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
              : "bg-gray-100/50 hover:bg-gray-200/50 text-gray-600"
          }`}
        >
          ✏️ ویرایش
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-xs px-3 py-1.5 rounded-xl font-semibold bg-red-100/50 text-red-500 hover:bg-red-200/50 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-all hover:scale-105"
        >
          🗑 حذف
        </button>
      </div>
    </div>
  );
}
