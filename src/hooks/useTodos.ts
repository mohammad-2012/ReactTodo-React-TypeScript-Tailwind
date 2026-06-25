import { useState, useEffect, useRef } from "react";
import type { Todo } from "../types/todo";
import { STORAGE_KEY } from "../constants";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

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

  const addTodo = (todo: Todo) => setTodos((prev) => [todo, ...prev]);
  const updateTodo = (id: string, updates: Partial<Todo>) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  const deleteTodo = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));
  const toggleComplete = (id: string) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  const toggleTimer = (id: string) =>
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, timerRunning: !t.timerRunning } : t,
      ),
    );
  const resetTimer = (id: string) =>
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, timerElapsed: 0, timerRunning: false } : t,
      ),
    );
  const clearCompleted = () =>
    setTodos((prev) => prev.filter((t) => !t.completed));

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    toggleTimer,
    resetTimer,
    clearCompleted,
  };
}
