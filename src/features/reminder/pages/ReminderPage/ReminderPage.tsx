import { useEffect, useState } from "react";
import {
    createReminder,
    getAllReminders,
    deleteReminder,
    updateReminder
} from "../../services/reminder.service";

import type { ReminderResponse } from "../../types/reminder.types";

import "./ReminderPage.css";

const ReminderPage = () => {

    const [reminders, setReminders] = useState<ReminderResponse[]>([]);
    const [message, setMessage] = useState("");
    const [remindAt, setRemindAt] = useState("");

    const [editId, setEditId] = useState<number | null>(null);

    const [alert, setAlert] = useState<string | null>(null);

    const loadReminders = async () => {
        try {

            const data = await getAllReminders();
            setReminders(data);

        } catch (err: any) {

            setAlert(
                err.response?.data?.massage ||
                "Failed to load reminders"
            );
        }
    };

    useEffect(() => {
        loadReminders();
    }, []);

    const handleCreateOrUpdate = async () => {

        try {

            if (editId) {

                const res = await updateReminder(editId, {
                    message,
                    remindAt
                });

                setAlert(res.data.data);
                setEditId(null);

            } else {

                const res = await createReminder({
                    message,
                    remindAt
                });

                setAlert(res.data.data);
            }

            setMessage("");
            setRemindAt("");

            loadReminders();

        } catch (err: any) {

            setAlert(
                err.response?.data?.massage ||
                "Operation failed"
            );
        }
    };

    const handleDelete = async (id: number) => {

        try {

            const res = await deleteReminder(id);

            setAlert(res.data.data);

            loadReminders();

        } catch (err: any) {

            setAlert(
                err.response?.data?.massage ||
                "Failed to delete reminder"
            );
        }
    };

    const handleEdit = (reminder: ReminderResponse) => {

        setEditId(reminder.id);

        setMessage(reminder.message);

        setRemindAt(reminder.remindAt.slice(0, 16)); // datetime input format
    };

    return (
        <div className="reminder-container">

            <h2>⏰ Reminder Manager</h2>

            {alert && (
                <div className="alert-box">
                    {alert}
                </div>
            )}

            <div className="reminder-form">

                <input
                    type="text"
                    placeholder="Reminder message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <input
                    type="datetime-local"
                    value={remindAt}
                    onChange={(e) => setRemindAt(e.target.value)}
                />

                <button onClick={handleCreateOrUpdate}>
                    {editId ? "Update Reminder" : "Create Reminder"}
                </button>

            </div>

            <div className="reminder-list">

                {reminders.map((r) => (

                    <div key={r.id} className="reminder-card">

                        <div>
                            <p>{r.message}</p>

                            <small>
                                {new Date(r.remindAt).toLocaleString()}
                            </small>
                        </div>

                        <div className="reminder-actions">

                            <button
                                onClick={() => handleEdit(r)}
                                className="edit-btn"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(r.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default ReminderPage;