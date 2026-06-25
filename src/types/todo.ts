export type Priority = "low" | "medium" | "high" | "critical";
export type FilterType = "all" | "active" | "completed";

export interface Todo {
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
