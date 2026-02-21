import API from "../../../config/axiosinstance";
import type {
    CreateTaskRequest,
    UpdateTaskRequest,
} from "../types/task.types";

export const createTask = (data: CreateTaskRequest) =>
    API.post("/tasks/add-new-task", data);

export const getAllTasks = () =>
    API.get("/tasks/get-all");

export const getTaskById = (taskId: number) =>
    API.get(`/tasks/get-by-id/${taskId}`);

export const updateTask = (
    taskId: number,
    data: UpdateTaskRequest
) =>
    API.put(`/tasks/update/${taskId}`, data);

export const deleteTask = (taskId: number) =>
    API.delete(`/tasks/delete/${taskId}`);