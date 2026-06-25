import type { FilterType, Priority } from "../types/todo";
import { PRIORITY_CONFIG } from "../constants";

interface SearchFilterProps {
  search: string;
  setSearch: (value: string) => void;
  filter: FilterType;
  setFilter: (value: FilterType) => void;
  priorityFilter: Priority | "all";
  setPriorityFilter: (value: Priority | "all") => void;
  dark: boolean;
}

export function SearchFilter({
  search,
  setSearch,
  filter,
  setFilter,
  priorityFilter,
  setPriorityFilter,
  dark,
}: SearchFilterProps) {
  return (
    <div
      className={`rounded-2xl p-3 mb-5 flex flex-col sm:flex-row gap-2 ${
        dark ? "bg-gray-900" : "bg-white shadow-sm border border-gray-100"
      }`}
    >
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[200px] text-sm bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500 px-2 py-1.5 text-gray-900 dark:text-gray-100"
      />
      <div className="flex gap-1.5 flex-wrap">
        {(["all", "active", "completed"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === f
                ? "bg-indigo-500 text-white"
                : dark
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "All" : f === "active" ? "Active" : "Completed"}
          </button>
        ))}
        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as Priority | "all")
          }
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold outline-none cursor-pointer transition-all ${
            dark
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          <option value="all">All Priorities</option>
          {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_CONFIG[p].label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
