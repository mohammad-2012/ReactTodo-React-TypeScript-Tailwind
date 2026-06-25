import { useState } from "react";
import type { Todo } from "../types/todo";
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
  return d.toLocaleDateString("en-US");
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
  const [expanded, setExpanded] = useState(false);
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
          ? "bg-gray-900/90 hover:bg-gray-800/90 border border-gray-700/30"
          : "bg-white hover:shadow-lg border border-gray-200 shadow-sm"
      }`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: todo.color }}
      />

      <div className="flex items-start gap-3 pl-3">
        <button
          onClick={() => onToggleComplete(todo.id)}
          className={`mt-0.5 w-6 h-6 rounded-xl flex-shrink-0 flex items-center justify-center border-2 transition-all duration-300 hover:scale-110 ${
            todo.completed
              ? "border-transparent text-white shadow-md"
              : dark
                ? "border-gray-600 hover:border-indigo-400"
                : "border-gray-300 hover:border-indigo-400"
          }`}
          style={
            todo.completed
              ? {
                  backgroundColor: todo.color,
                  borderColor: todo.color,
                  boxShadow: `0 0 20px ${todo.color}40`,
                }
              : {}
          }
        >
          {todo.completed && <span className="text-xs">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-bold text-sm leading-snug ${
                todo.completed
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : dark
                    ? "text-gray-100"
                    : "text-black"
              }`}
            >
              {todo.title}
            </h3>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-xl font-semibold ${
                  dark ? `${p.color} ${p.bg} ${p.darkBg}` : `${p.color} ${p.bg}`
                }`}
              >
                {p.label}
              </span>

              {overdue && (
                <span className="text-xs px-2.5 py-0.5 rounded-xl font-semibold text-red-600 bg-red-100 dark:bg-red-900/30 animate-pulse">
                  ⚠️
                </span>
              )}

              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(todo)}
                  className={`text-xs px-2 py-1 rounded-lg font-semibold transition-all duration-200 hover:scale-110 ${
                    dark
                      ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300"
                      : "bg-gray-200/80 hover:bg-gray-300/80 text-gray-700"
                  }`}
                  title="Edit task"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className={`text-xs px-2 py-1 rounded-lg font-semibold transition-all duration-200 hover:scale-110 ${
                    dark
                      ? "bg-red-900/30 hover:bg-red-900/50 text-red-400"
                      : "bg-red-100 hover:bg-red-200 text-red-600"
                  }`}
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>

          {todo.description && (
            <p
              className={`text-sm mt-1 leading-relaxed line-clamp-2 ${
                dark ? "text-gray-400" : "text-gray-700"
              }`}
            >
              {todo.description}
            </p>
          )}

          {todo.timerSeconds > 0 && (
            <div className="mt-3">
              <div
                className={`h-2 rounded-full overflow-hidden mb-2 ${
                  dark ? "bg-gray-800/70" : "bg-gray-200/80"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    timerDone
                      ? "bg-green-500"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500"
                  }`}
                  style={{ width: `${tp}%` }}
                />
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-base font-mono font-bold ${
                    timerDone
                      ? "text-green-600 dark:text-green-400"
                      : "text-indigo-600 dark:text-indigo-400"
                  }`}
                >
                  {timerDone ? "✅ Done" : formatTime(todo.timerElapsed)} /{" "}
                  {formatTime(todo.timerSeconds)}
                </span>
                <button
                  onClick={() => onToggleTimer(todo.id)}
                  disabled={timerDone}
                  className={`text-sm px-4 py-1 rounded-xl font-semibold transition-all duration-200 hover:scale-110 disabled:opacity-30 ${
                    todo.timerRunning
                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                  }`}
                >
                  {todo.timerRunning ? "⏸ Pause" : "▶ Start"}
                </button>
                <button
                  onClick={() => onResetTimer(todo.id)}
                  className={`text-sm px-4 py-1 rounded-xl font-semibold transition-all duration-200 hover:scale-110 ${
                    dark
                      ? "bg-gray-800/70 text-gray-400 hover:bg-gray-700/70"
                      : "bg-gray-200/80 text-gray-600 hover:bg-gray-300/80"
                  }`}
                >
                  ↺ Reset
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className={`mt-3 text-xs font-semibold transition-all hover:scale-105 ${
              dark
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {expanded ? "▲ Show Less" : "▼ Show More"}
          </button>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 space-y-2">
              {todo.description && (
                <div>
                  <span
                    className={`text-xs font-semibold ${
                      dark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Description:
                  </span>
                  <p
                    className={`text-sm mt-1 leading-relaxed ${
                      dark ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {todo.description}
                  </p>
                </div>
              )}

              {(todo.dueDate || todo.dueTime) && (
                <div
                  className={`flex items-center gap-2 text-sm ${
                    dark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold ${
                      dark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Due:
                  </span>
                  {todo.dueDate && <span>{formatDate(todo.dueDate)}</span>}
                  {todo.dueTime && <span>⏰ {todo.dueTime}</span>}
                </div>
              )}

              {todo.tags.length > 0 && (
                <div>
                  <span
                    className={`text-xs font-semibold ${
                      dark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Tags:
                  </span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {todo.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2.5 py-0.5 rounded-xl font-medium ${
                          dark
                            ? "bg-gray-800/70 text-gray-300"
                            : "bg-gray-200/80 text-gray-700"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`text-xs ${
                  dark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Created: {new Date(todo.createdAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
