import API from "../../../config/axiosinstance";
import type {
    CreateTaskRequest,
    UpdateTaskRequest,
} from "../types/task.types";

export const createTask = (
    data: CreateTaskRequest,
    userId: number
) =>
    API.post("/tasks/add-new-task", data, {
        headers: { "X-User-Id": userId },
    });

export const getAllTasks = (userId: number) =>
    API.get("/tasks/get-all", {
        headers: { "X-User-Id": userId },
    });

export const getTaskById = (taskId: number, userId: number) =>
    API.get(`/tasks/get-by-id/${taskId}`, {
        headers: { "X-User-Id": userId },
    });

export const updateTask = (
    taskId: number,
    data: UpdateTaskRequest,
    userId: number
) =>
    API.put(`/tasks/update/${taskId}`, data, {
        headers: { "X-User-Id": userId },
    });

export const deleteTask = (taskId: number, userId: number) =>
    API.delete(`/tasks/delete/${taskId}`, {
        headers: { "X-User-Id": userId },
    });
