import type { TaskStatus } from "./task.types";

export interface TaskFilter {
    status: "ALL" | TaskStatus;
    date?: string;
    keyword?: string;
}