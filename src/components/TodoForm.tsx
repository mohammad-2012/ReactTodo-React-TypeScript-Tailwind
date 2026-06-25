import { PRIORITY_CONFIG, COLOR_OPTIONS } from "../constants";
import type { Priority } from "../types/todo";
import { useState } from "react";

interface FormData {
  title: string;
  description: string;
  priority: Priority;
  color: string;
  dueDate: string;
  dueTime: string;
  timerSeconds: number;
  tags: string[];
}

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  editData?: (FormData & { id?: string }) | null;
  dark: boolean;
}

export function TodoForm({
  isOpen,
  onClose,
  onSubmit,
  editData,
  dark,
}: TodoFormProps) {
  const [form, setForm] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    priority: editData?.priority || ("medium" as Priority),
    color: editData?.color || "#818cf8",
    dueDate: editData?.dueDate || "",
    dueTime: editData?.dueTime || "",
    timerSeconds: editData?.timerSeconds || 0,
    tags: editData?.tags?.join(", ") || "",
  });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: form.title,
      description: form.description,
      priority: form.priority,
      color: form.color,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      timerSeconds: parseInt(String(form.timerSeconds)) || 0,
      tags,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto transition-all duration-300 ${
            dark ? "glass-dark" : "glass"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {editData ? "✏️ Edit Task" : "➕ New Task"}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl hover:bg-white/10 transition-all"
            >
              ✕
            </button>
          </div>

          <input
            type="text"
            placeholder="Task title..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={`w-full rounded-2xl px-4 py-3 text-sm outline-none mb-3 font-semibold ${
              dark
                ? "bg-gray-800/50 placeholder-gray-500 focus:bg-gray-800/70"
                : "bg-gray-100/50 placeholder-gray-400 focus:bg-gray-100/70"
            }`}
          />

          <textarea
            placeholder="Description (optional)..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className={`w-full rounded-2xl px-4 py-3 text-sm outline-none mb-3 resize-none ${
              dark
                ? "bg-gray-800/50 placeholder-gray-500 focus:bg-gray-800/70"
                : "bg-gray-100/50 placeholder-gray-400 focus:bg-gray-100/70"
            }`}
          />

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 block">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as Priority })
                }
                className={`w-full rounded-2xl px-3 py-2.5 text-sm outline-none cursor-pointer ${
                  dark
                    ? "bg-gray-800/50 text-gray-200"
                    : "bg-gray-100/50 text-gray-700"
                }`}
              >
                {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_CONFIG[p].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 block">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className={`w-full rounded-2xl px-3 py-2.5 text-sm outline-none ${
                  dark
                    ? "bg-gray-800/50 text-gray-200"
                    : "bg-gray-100/50 text-gray-700"
                }`}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 block">
                Time
              </label>
              <input
                type="time"
                value={form.dueTime}
                onChange={(e) => setForm({ ...form, dueTime: e.target.value })}
                className={`w-full rounded-2xl px-3 py-2.5 text-sm outline-none ${
                  dark
                    ? "bg-gray-800/50 text-gray-200"
                    : "bg-gray-100/50 text-gray-700"
                }`}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 block">
                Timer (seconds)
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 1500"
                value={form.timerSeconds || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    timerSeconds: parseInt(e.target.value) || 0,
                  })
                }
                className={`w-full rounded-2xl px-3 py-2.5 text-sm outline-none ${
                  dark
                    ? "bg-gray-800/50 text-gray-200"
                    : "bg-gray-100/50 text-gray-700"
                }`}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 block">
              Tags (separate with commas)
            </label>
            <input
              type="text"
              placeholder="e.g. work, important, project"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className={`w-full rounded-2xl px-3 py-2.5 text-sm outline-none ${
                dark
                  ? "bg-gray-800/50 placeholder-gray-500"
                  : "bg-gray-100/50 placeholder-gray-400"
              }`}
            />
          </div>

          <div className="mb-5">
            <label className="text-xs text-gray-400 dark:text-gray-500 mb-2 block">
              Color
            </label>
            <div className="flex gap-3 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-8 h-8 rounded-full transition-all duration-300 hover:scale-110 ${
                    form.color === c
                      ? "ring-2 ring-offset-2 ring-offset-transparent scale-110"
                      : ""
                  }`}
                  style={{ backgroundColor: c, ringColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!form.title.trim()}
              className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-indigo-400/30 active:scale-95"
            >
              {editData ? "💾 Save Changes" : "✨ Add Task"}
            </button>
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
                dark
                  ? "bg-gray-800/50 hover:bg-gray-700/50"
                  : "bg-gray-100/50 hover:bg-gray-200/50"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
