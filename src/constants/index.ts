import { Priority } from "../types/todo";

export const PRIORITY_CONFIG: Record<
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

export const COLOR_OPTIONS = [
  "#818cf8", // indigo-400
  "#a78bfa", // violet-400
  "#f472b6", // pink-400
  "#fb7185", // rose-400
  "#fb923c", // orange-400
  "#facc15", // yellow-400
  "#4ade80", // green-400
  "#2dd4bf", // teal-400
  "#60a5fa", // blue-400
];

export const STORAGE_KEY = "ultra_todos_v1";
export const THEME_KEY = "ultra_todos_theme";
