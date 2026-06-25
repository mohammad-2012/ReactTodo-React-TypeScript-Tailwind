import { useState } from "react";
import { useTodos } from "./hooks/useTodos";
import { Header } from "./components/Header";
import { ProgressBar } from "./components/ProgressBar";
import { SearchFilter } from "./components/SearchFilter";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import { Footer } from "./components/Footer";
import { THEME_KEY } from "./constants";
import { Todo } from "./types/todo";

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export default function App() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<any>("all");
  const [showForm, setShowForm] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    toggleTimer,
    resetTimer,
    clearCompleted,
  } = useTodos();

  const toggleTheme = () => {
    setDark(!dark);
    localStorage.setItem(THEME_KEY, !dark ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  const handleSubmit = (data: any) => {
    if (editTodo) {
      updateTodo(editTodo.id, data);
      setEditTodo(null);
    } else {
      const newTodo: Todo = {
        id: generateId(),
        title: data.title,
        description: data.description,
        completed: false,
        priority: data.priority,
        color: data.color,
        dueDate: data.dueDate,
        dueTime: data.dueTime,
        timerSeconds: data.timerSeconds,
        timerRunning: false,
        timerElapsed: 0,
        createdAt: new Date().toISOString(),
        tags: data.tags,
      };
      addTodo(newTodo);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTodo(null);
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = todos.length
    ? Math.round((completedCount / todos.length) * 100)
    : 0;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark ? "dark bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Header
          dark={dark}
          toggleTheme={toggleTheme}
          completedCount={completedCount}
          totalCount={todos.length}
        />

        {todos.length > 0 && <ProgressBar progress={progressPercent} />}

        <SearchFilter
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          dark={dark}
        />

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 rounded-2xl mb-5 text-sm font-bold text-white bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:opacity-90 transition-all shadow-lg shadow-indigo-400/30 active:scale-95"
          >
            ✦ کار جدید اضافه کن
          </button>
        )}

        <TodoForm
          isOpen={showForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          editData={editTodo}
          dark={dark}
        />

        <TodoList
          todos={todos}
          filter={filter}
          priorityFilter={priorityFilter}
          search={search}
          onToggleComplete={toggleComplete}
          onEdit={handleEdit}
          onDelete={deleteTodo}
          onToggleTimer={toggleTimer}
          onResetTimer={resetTimer}
          dark={dark}
        />

        <Footer
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />
      </div>
    </div>
  );
}
