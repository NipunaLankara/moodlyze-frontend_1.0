export interface ReminderRequest {
    message: string;
    remindAt: string;
}

export interface ReminderUpdateRequest {
    message?: string;
    remindAt?: string;
}

export interface ReminderResponse {
    id: number;
    message: string;
    remindAt: string;
}

export interface StandardResponse<T> {
    code: number;
    message: string;
    data: T;
}