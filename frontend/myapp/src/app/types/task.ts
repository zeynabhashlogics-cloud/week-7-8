
export type statustype = "completed" | "pending";

export type prioritytype = "low" | "high" | "medium";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: statustype;
  priority: prioritytype;
  dueDate: string | null;
  createdAt: string;
  userId: number;
};
