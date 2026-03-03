import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ReminderCalendar.css";

import {
    getAllReminders,
    createReminder,
    updateReminder,
    deleteReminder,
} from "../services/reminder.service";

import type { ReminderResponse } from "../types/reminder.types";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
    id?: number;
};

const ReminderCalendar = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentReminder, setCurrentReminder] =
        useState<ReminderResponse | null>(null);
    const [message, setMessage] = useState("");
    const [remindAt, setRemindAt] = useState("");
    const [alert, setAlert] = useState<string | null>(null);

    const loadReminders = async () => {
        try {
            const data = await getAllReminders();

            const mapped = data.map((r) => ({
                id: r.id,
                title: r.message,
                start: new Date(r.remindAt),
                end: new Date(new Date(r.remindAt).getTime() + 30 * 60 * 1000),
            }));

            setEvents(mapped);
        } catch (error) {
            console.error(error);
            setAlert("Failed to load reminders");
        }
    };

    useEffect(() => {
        loadReminders();
    }, []);

    const handleSelectSlot = (slotInfo: any) => {
        setCurrentReminder(null);
        setMessage("");
        setRemindAt(format(slotInfo.start, "yyyy-MM-dd'T'HH:mm"));
        setModalOpen(true);
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        setCurrentReminder({
            id: event.id!,
            message: event.title,
            remindAt: event.start.toISOString(),
        });

        setMessage(event.title);
        setRemindAt(format(event.start, "yyyy-MM-dd'T'HH:mm"));
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (!message.trim()) {
                setAlert("Message is required");
                return;
            }

            if (currentReminder) {
                await updateReminder(currentReminder.id!, { message, remindAt });
                setAlert("Reminder updated");
            } else {
                await createReminder({ message, remindAt });
                setAlert("Reminder created");
            }

            setModalOpen(false);
            loadReminders();
        } catch (err: any) {
            setAlert(err.response?.data?.message || "Failed to save reminder");
        }
    };

    const handleDelete = async () => {
        if (!currentReminder) return;

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this reminder?"
        );
        if (!confirmDelete) return;

        try {
            await deleteReminder(currentReminder.id!);
            setAlert("Reminder deleted");
            setModalOpen(false);
            loadReminders();
        } catch (err: any) {
            setAlert(err.response?.data?.message || "Failed to delete reminder");
        }
    };

    return (
        <div className="calendar-container">
            <h2 className="calendar-title">Reminder Calendar</h2>

            {alert && <div className="alert-box">{alert}</div>}

            <Calendar
                selectable
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                style={{ height: "75vh" }}
            />

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>
                            {currentReminder ? "Edit Reminder" : "Create Reminder"}
                        </h3>

                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Reminder message"
                            className="input-field"
                        />

                        <input
                            type="datetime-local"
                            value={remindAt}
                            onChange={(e) => setRemindAt(e.target.value)}
                            className="input-field"
                        />

                        <div className="button-group">
                            <button className="btn primary" onClick={handleSave}>
                                {currentReminder ? "Update" : "Create"}
                            </button>

                            {currentReminder && (
                                <button className="btn danger" onClick={handleDelete}>
                                    Delete
                                </button>
                            )}

                            <button
                                className="btn secondary"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReminderCalendar;