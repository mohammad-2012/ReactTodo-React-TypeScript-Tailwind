import { useState, useEffect, useRef } from "react";

type Priority = "low" | "medium" | "high" | "critical";
type FilterType = "all" | "active" | "completed";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  color: string;
  dueDate: string;
  dueTime: string;
  timerSeconds: number;
  timerRunning: boolean;
  timerElapsed: number;
  createdAt: string;
  tags: string[];
}

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string; darkBg: string }
> = {
  low: {
    label: "کم",
    color: "text-emerald-500",
    bg: "bg-emerald-100",
    darkBg: "dark:bg-emerald-900/30",
  },
  medium: {
    label: "متوسط",
    color: "text-amber-500",
    bg: "bg-amber-100",
    darkBg: "dark:bg-amber-900/30",
  },
  high: {
    label: "زیاد",
    color: "text-orange-500",
    bg: "bg-orange-100",
    darkBg: "dark:bg-orange-900/30",
  },
  critical: {
    label: "فوری",
    color: "text-red-500",
    bg: "bg-red-100",
    darkBg: "dark:bg-red-900/30",
  },
};

const COLOR_OPTIONS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
];

const STORAGE_KEY = "ultra_todos_v1";
const THEME_KEY = "ultra_todos_theme";

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
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

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    color: "#6366f1",
    dueDate: "",
    dueTime: "",
    timerSeconds: 0,
    tags: "",
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTodos((prev) =>
        prev.map((t) =>
          t.timerRunning ? { ...t, timerElapsed: t.timerElapsed + 1 } : t,
        ),
      );
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      priority: "medium",
      color: "#6366f1",
      dueDate: "",
      dueTime: "",
      timerSeconds: 0,
      tags: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editId) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === editId
            ? {
                ...t,
                title: form.title,
                description: form.description,
                priority: form.priority,
                color: form.color,
                dueDate: form.dueDate,
                dueTime: form.dueTime,
                timerSeconds: form.timerSeconds,
                tags,
              }
            : t,
        ),
      );
    } else {
      const newTodo: Todo = {
        id: generateId(),
        title: form.title,
        description: form.description,
        completed: false,
        priority: form.priority,
        color: form.color,
        dueDate: form.dueDate,
        dueTime: form.dueTime,
        timerSeconds: form.timerSeconds,
        timerRunning: false,
        timerElapsed: 0,
        createdAt: new Date().toISOString(),
        tags,
      };
      setTodos((prev) => [newTodo, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (todo: Todo) => {
    setForm({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      color: todo.color,
      dueDate: todo.dueDate,
      dueTime: todo.dueTime,
      timerSeconds: todo.timerSeconds,
      tags: todo.tags.join(", "),
    });
    setEditId(todo.id);
    setShowForm(true);
  };

  const toggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTimer = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, timerRunning: !t.timerRunning } : t,
      ),
    );
  };

  const resetTimer = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, timerElapsed: 0, timerRunning: false } : t,
      ),
    );
  };

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

  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = todos.length
    ? Math.round((completedCount / todos.length) * 100)
    : 0;

  const isOverdue = (todo: Todo) => {
    if (!todo.dueDate || todo.completed) return false;
    const due = new Date(
      todo.dueDate + (todo.dueTime ? "T" + todo.dueTime : "T23:59"),
    );
    return due < new Date();
  };

  const timerProgress = (todo: Todo) => {
    if (!todo.timerSeconds) return 0;
    return Math.min(100, (todo.timerElapsed / todo.timerSeconds) * 100);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${dark ? "dark bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              ✦ تودولیست
            </h1>
            <p className="text-sm mt-1 text-gray-400">
              {completedCount} از {todos.length} کار انجام شد
            </p>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${dark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100 shadow-sm border border-gray-200"}`}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {todos.length > 0 && (
          <div
            className={`rounded-2xl p-4 mb-6 ${dark ? "bg-gray-900" : "bg-white shadow-sm border border-gray-100"}`}
          >
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>پیشرفت کلی</span>
              <span>{progressPercent}٪</span>
            </div>
            <div
              className={`h-2 rounded-full overflow-hidden ${dark ? "bg-gray-800" : "bg-gray-100"}`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div
          className={`rounded-2xl p-3 mb-5 flex flex-wrap gap-2 ${dark ? "bg-gray-900" : "bg-white shadow-sm border border-gray-100"}`}
        >
          <input
            type="text"
            placeholder="🔍 جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 min-w-32 text-sm bg-transparent outline-none placeholder-gray-400`}
          />
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "active", "completed"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-indigo-500 text-white" : dark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {f === "all" ? "همه" : f === "active" ? "فعال" : "انجام شده"}
              </button>
            ))}
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as Priority | "all")
              }
              className={`px-2 py-1 rounded-lg text-xs font-semibold outline-none cursor-pointer transition-all ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-500"}`}
            >
              <option value="all">همه اولویت‌ها</option>
              {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_CONFIG[p].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showForm && (
          <div
            className={`rounded-2xl p-5 mb-5 border-2 transition-all ${dark ? "bg-gray-900 border-indigo-500/30" : "bg-white border-indigo-200 shadow-md"}`}
          >
            <h2 className="font-bold text-lg mb-4">
              {editId ? "✏️ ویرایش کار" : "➕ کار جدید"}
            </h2>

            <input
              type="text"
              placeholder="عنوان کار..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full rounded-xl px-4 py-3 text-sm outline-none mb-3 font-semibold transition-all ${dark ? "bg-gray-800 placeholder-gray-500 focus:bg-gray-700" : "bg-gray-50 placeholder-gray-400 focus:bg-gray-100 border border-gray-200"}`}
            />

            <textarea
              placeholder="توضیحات (اختیاری)..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className={`w-full rounded-xl px-4 py-3 text-sm outline-none mb-3 resize-none transition-all ${dark ? "bg-gray-800 placeholder-gray-500 focus:bg-gray-700" : "bg-gray-50 placeholder-gray-400 focus:bg-gray-100 border border-gray-200"}`}
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  اولویت
                </label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value as Priority })
                  }
                  className={`w-full rounded-xl px-3 py-2 text-sm outline-none cursor-pointer ${dark ? "bg-gray-800 text-gray-200" : "bg-gray-50 border border-gray-200"}`}
                >
                  {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_CONFIG[p].label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  تاریخ سررسید
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className={`w-full rounded-xl px-3 py-2 text-sm outline-none ${dark ? "bg-gray-800 text-gray-200" : "bg-gray-50 border border-gray-200"}`}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ساعت</label>
                <input
                  type="time"
                  value={form.dueTime}
                  onChange={(e) =>
                    setForm({ ...form, dueTime: e.target.value })
                  }
                  className={`w-full rounded-xl px-3 py-2 text-sm outline-none ${dark ? "bg-gray-800 text-gray-200" : "bg-gray-50 border border-gray-200"}`}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  تایمر (ثانیه)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="مثلاً ۱۵۰۰"
                  value={form.timerSeconds || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      timerSeconds: parseInt(e.target.value) || 0,
                    })
                  }
                  className={`w-full rounded-xl px-3 py-2 text-sm outline-none ${dark ? "bg-gray-800 text-gray-200" : "bg-gray-50 border border-gray-200"}`}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-400 mb-1 block">
                برچسب‌ها (با کاما جدا کن)
              </label>
              <input
                type="text"
                placeholder="مثلاً: کار, مهم, پروژه"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 text-sm outline-none ${dark ? "bg-gray-800 placeholder-gray-500" : "bg-gray-50 placeholder-gray-400 border border-gray-200"}`}
              />
            </div>

            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-2 block">رنگ</label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className={`w-7 h-7 rounded-full transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-offset-transparent scale-110" : ""}`}
                    style={{ backgroundColor: c, ringColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={!form.title.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-l from-indigo-500 to-purple-500 hover:opacity-90 disabled:opacity-40 transition-all"
              >
                {editId ? "ذخیره تغییرات" : "افزودن"}
              </button>
              <button
                onClick={resetForm}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${dark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                لغو
              </button>
            </div>
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3.5 rounded-2xl mb-5 text-sm font-bold text-white bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            ✦ کار جدید اضافه کن
          </button>
        )}

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div
              className={`text-center py-16 rounded-2xl ${dark ? "bg-gray-900" : "bg-white border border-gray-100"}`}
            >
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-gray-400 text-sm">
                {todos.length === 0 ? "هنوز کاری اضافه نشده" : "کاری پیدا نشد"}
              </p>
            </div>
          )}

          {filtered.map((todo) => {
            const p = PRIORITY_CONFIG[todo.priority];
            const overdue = isOverdue(todo);
            const tp = timerProgress(todo);
            const timerDone =
              todo.timerSeconds > 0 && todo.timerElapsed >= todo.timerSeconds;

            return (
              <div
                key={todo.id}
                className={`rounded-2xl p-4 transition-all group relative overflow-hidden ${todo.completed ? "opacity-60" : ""} ${dark ? "bg-gray-900 hover:bg-gray-800/80" : "bg-white hover:shadow-md border border-gray-100 shadow-sm"}`}
              >
                <div
                  className="absolute right-0 top-0 bottom-0 w-1 rounded-r-2xl"
                  style={{ backgroundColor: todo.color }}
                />

                <div className="flex items-start gap-3 pr-3">
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-all ${todo.completed ? "border-transparent text-white" : dark ? "border-gray-600 hover:border-indigo-400" : "border-gray-300 hover:border-indigo-400"}`}
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
                        className={`font-bold text-sm leading-snug ${todo.completed ? "line-through" : ""}`}
                      >
                        {todo.title}
                      </h3>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${p.color} ${p.bg} ${p.darkBg}`}
                        >
                          {p.label}
                        </span>
                        {overdue && (
                          <span className="text-xs px-2 py-0.5 rounded-lg font-semibold text-red-500 bg-red-100 dark:bg-red-900/30">
                            دیر شده!
                          </span>
                        )}
                      </div>
                    </div>

                    {todo.description && (
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {todo.description}
                      </p>
                    )}

                    {(todo.dueDate || todo.dueTime) && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <span>📅</span>
                        {todo.dueDate && (
                          <span>{formatDate(todo.dueDate)}</span>
                        )}
                        {todo.dueTime && <span>⏰ {todo.dueTime}</span>}
                      </div>
                    )}

                    {todo.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {todo.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-0.5 rounded-md ${dark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-500"}`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {todo.timerSeconds > 0 && (
                      <div className="mt-3">
                        <div
                          className={`h-1.5 rounded-full overflow-hidden mb-1.5 ${dark ? "bg-gray-800" : "bg-gray-100"}`}
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${timerDone ? "bg-green-500" : "bg-indigo-500"}`}
                            style={{ width: `${tp}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono font-bold ${timerDone ? "text-green-500" : "text-indigo-400"}`}
                          >
                            {timerDone
                              ? "✓ تموم شد"
                              : formatTime(todo.timerElapsed)}{" "}
                            / {formatTime(todo.timerSeconds)}
                          </span>
                          <button
                            onClick={() => toggleTimer(todo.id)}
                            disabled={timerDone}
                            className={`text-xs px-2 py-0.5 rounded-md font-semibold transition-all disabled:opacity-30 ${todo.timerRunning ? "bg-red-100 text-red-500 dark:bg-red-900/30" : "bg-indigo-100 text-indigo-500 dark:bg-indigo-900/30"}`}
                          >
                            {todo.timerRunning ? "⏸ وقفه" : "▶ شروع"}
                          </button>
                          <button
                            onClick={() => resetTimer(todo.id)}
                            className="text-xs px-2 py-0.5 rounded-md font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 transition-all"
                          >
                            ↺ ریست
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`flex gap-2 mt-3 pr-9 transition-all opacity-0 group-hover:opacity-100`}
                >
                  <button
                    onClick={() => handleEdit(todo)}
                    className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${dark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
                  >
                    ✏️ ویرایش
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-xs px-3 py-1 rounded-lg font-semibold bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-all"
                  >
                    🗑 حذف
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {todos.length > 0 && completedCount > 0 && (
          <button
            onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-500 transition-all"
          >
            🗑 حذف همه انجام‌شده‌ها ({completedCount})
          </button>
        )}

        <p className="text-center text-xs text-gray-500 mt-8">
          ✦ ذخیره خودکار در مرورگر
        </p>
      </div>
    </div>
  );
}
