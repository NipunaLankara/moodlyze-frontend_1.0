import API from "../../../config/axiosinstance";
import type {
    ReminderRequest,
    ReminderUpdateRequest,
    ReminderResponse
} from "../types/reminder.types";


export const createReminder = async (data: ReminderRequest) => {
    const res = await API.post("/reminders/create", data);
    return res.data;
};


export const getAllReminders = async (): Promise<ReminderResponse[]> => {
    const res = await API.get("/reminders/get-all");
    return res.data.data;
};

export const updateReminder = async (
    id: number,
    data: ReminderUpdateRequest
) => {
    const res = await API.put(`/reminders/update/${id}`, data);
    return res.data;
};


export const deleteReminder = async (id: number) => {
    const res = await API.delete(`/reminders/delete/${id}`);
    return res.data;
};