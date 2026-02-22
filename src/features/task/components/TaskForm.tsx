import { useState } from "react";
import { createTask } from "../services/task.service";
import type {
    CreateTaskRequest,
    TaskResponse,
} from "../types/task.types";

type Props = {
    onTaskAdded: (task: TaskResponse) => void;
    disabled: boolean;
};

const initialFormState: CreateTaskRequest = {
    title: "",
    description: "",
    priority: "MEDIUM",
    estimatedTimeMinutes: 30,
    taskDate: new Date().toISOString().split("T")[0],
    deadlineTime: "",
};

const TaskForm = ({ onTaskAdded, disabled }: Props) => {
    const [form, setForm] = useState<CreateTaskRequest>(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    /* ---------------- HANDLE CHANGE ---------------- */

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]:
                name === "estimatedTimeMinutes"
                    ? Number(value)
                    : value,
        }));
    };

    /* ---------------- VALIDATION ---------------- */

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!form.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!form.taskDate) {
            newErrors.taskDate = "Task date is required";
        }

        if (!form.estimatedTimeMinutes || form.estimatedTimeMinutes <= 0) {
            newErrors.estimatedTimeMinutes =
                "Estimated time must be greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ---------------- SUBMIT ---------------- */

    const submit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const res = await createTask(form);

            onTaskAdded(res.data.data);

            setForm(initialFormState);
            setErrors({});

            // 🔥 AUTO FULL PAGE RELOAD
            window.location.reload();

        } catch (error) {
            alert("Failed to add task");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <div
            style={{
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                background: "#ffffff",
                maxWidth: "500px"
            }}
        >
            <h2 style={{ marginBottom: "25px" }}>Add New Task</h2>

            {disabled && (
                <p style={{ color: "red", marginBottom: "15px" }}>
                    Daily task limit reached (15 per day)
                </p>
            )}

            {/* TITLE */}
            <div style={{ marginBottom: "18px" }}>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Title:
                </label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    disabled={disabled || loading}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                />
                {errors.title && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                        {errors.title}
                    </p>
                )}
            </div>

            {/* DESCRIPTION */}
            <div style={{ marginBottom: "18px" }}>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Description:
                </label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    disabled={disabled || loading}
                    style={{
                        width: "100%",
                        minHeight: "80px",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                />
            </div>

            {/* PRIORITY */}
            <div style={{ marginBottom: "18px" }}>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Priority:
                </label>
                <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    disabled={disabled || loading}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                </select>
            </div>

            {/* ESTIMATED TIME */}
            <div style={{ marginBottom: "18px" }}>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Estimated Time (minutes):
                </label>
                <input
                    type="number"
                    name="estimatedTimeMinutes"
                    value={form.estimatedTimeMinutes}
                    onChange={handleChange}
                    disabled={disabled || loading}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                />
                {errors.estimatedTimeMinutes && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                        {errors.estimatedTimeMinutes}
                    </p>
                )}
            </div>

            {/* TASK DATE */}
            <div style={{ marginBottom: "18px" }}>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Task Date:
                </label>
                <input
                    type="date"
                    name="taskDate"
                    value={form.taskDate}
                    onChange={handleChange}
                    disabled={disabled || loading}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                />
                {errors.taskDate && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                        {errors.taskDate}
                    </p>
                )}
            </div>

            {/* DEADLINE TIME */}
            <div style={{ marginBottom: "25px" }}>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Deadline Time:
                </label>
                <input
                    type="time"
                    name="deadlineTime"
                    value={form.deadlineTime || ""}
                    onChange={handleChange}
                    disabled={disabled || loading}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                />
            </div>

            {/* SUBMIT BUTTON */}
            <button
                onClick={submit}
                disabled={disabled || loading}
                style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer"
                }}
            >
                {loading ? "Adding Task..." : "Add Task"}
            </button>
        </div>
    );
};

export default TaskForm;