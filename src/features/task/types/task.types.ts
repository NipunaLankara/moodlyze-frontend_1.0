export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "PENDING" | "COMPLETED";

export interface CreateTaskRequest {
    title: string;
    description?: string;
    priority: Priority;
    estimatedTimeMinutes: number;
    deadlineTime?: string; // HH:mm
    taskDate: string; // yyyy-MM-dd
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    priority?: Priority;
    estimatedTimeMinutes?: number;
    deadlineTime?: string;
    status?: TaskStatus;
}

export interface TaskResponse {
    id: number;
    title: string;
    description?: string;
    priority: Priority;
    estimatedTimeMinutes: number;
    deadlineTime?: string;
    taskDate: string;
    status: TaskStatus;
}
