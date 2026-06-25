import { FilterType, Priority } from "../types/todo";
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
    <div className="glass rounded-2xl p-3 mb-5 flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        placeholder="🔍 جستجو در کارها..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[200px] text-sm bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500 px-2 py-1.5"
      />
      <div className="flex gap-1.5 flex-wrap">
        {(["all", "active", "completed"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              filter === f
                ? "bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-lg shadow-indigo-400/30"
                : dark
                  ? "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                  : "bg-gray-100/50 text-gray-500 hover:bg-gray-200/50"
            }`}
          >
            {f === "all" ? "همه" : f === "active" ? "فعال" : "انجام شده"}
          </button>
        ))}
        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as Priority | "all")
          }
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold outline-none cursor-pointer transition-all ${
            dark
              ? "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
              : "bg-gray-100/50 text-gray-500 hover:bg-gray-200/50"
          }`}
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
  );
}
