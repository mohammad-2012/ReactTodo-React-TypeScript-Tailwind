import type { Todo, FilterType, Priority } from "../types/todo";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  priorityFilter: Priority | "all";
  search: string;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
  dark: boolean;
}

export function TodoList({
  todos,
  filter,
  priorityFilter,
  search,
  onToggleComplete,
  onEdit,
  onDelete,
  onToggleTimer,
  onResetTimer,
  dark,
}: TodoListProps) {
  const filtered = todos.filter((t) => {
    if (filter === "active" && t.completed) return false;
    if (filter === "completed" && !t.completed) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (
      search &&
      !t.title.toLowerCase().includes(search.toLowerCase()) &&
      !t.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div
        className={`text-center py-20 rounded-3xl ${
          dark
            ? "bg-gray-900 border border-gray-700/30"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div className="text-6xl mb-4 animate-bounce">🎯</div>
        <p
          className={`text-sm font-medium ${
            dark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {todos.length === 0 ? "No tasks yet!" : "No tasks found!"}
        </p>
        {todos.length === 0 && (
          <p
            className={`text-xs mt-1 ${
              dark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Click ✦ Add New Task to get started!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleTimer={onToggleTimer}
          onResetTimer={onResetTimer}
          dark={dark}
        />
      ))}
    </div>
  );
}
