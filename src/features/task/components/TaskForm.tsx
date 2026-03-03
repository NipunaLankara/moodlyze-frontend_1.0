import { useState } from "react";
import { createTask } from "../services/task.service";
import type { CreateTaskRequest, TaskResponse } from "../types/task.types";
import "./css/TaskForm.css";

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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "estimatedTimeMinutes" ? Number(value) : value,
        }));
        // Clear error on change
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.taskDate) newErrors.taskDate = "Date is required";
        if (!form.estimatedTimeMinutes || form.estimatedTimeMinutes <= 0)
            newErrors.estimatedTimeMinutes = "Must be greater than 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async () => {
        if (!validateForm()) return;
        try {
            setLoading(true);
            const res = await createTask(form);
            onTaskAdded(res.data.data);
            setForm(initialFormState);
            setErrors({});
            window.location.reload();
        } catch {
            alert("Failed to add task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tf-form">
            <h3 className="tf-form__title">✏️ New Task</h3>

            {disabled && (
                <div className="tf-limit-banner">
                    ⚠️ Daily limit reached — 15 tasks maximum per day
                </div>
            )}

            {/* Title */}
            <div className={`tf-field ${errors.title ? "tf-field--error" : ""}`}>
                <label className="tf-label">Title <span className="tf-required">*</span></label>
                <input
                    className="tf-input"
                    name="title"
                    placeholder="What needs to be done?"
                    value={form.title}
                    onChange={handleChange}
                    disabled={disabled || loading}
                />
                {errors.title && <span className="tf-error-msg">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="tf-field">
                <label className="tf-label">Description</label>
                <textarea
                    className="tf-input tf-textarea"
                    name="description"
                    placeholder="Add more details (optional)"
                    value={form.description}
                    onChange={handleChange}
                    disabled={disabled || loading}
                />
            </div>

            {/* Priority + Estimated Time */}
            <div className="tf-row">
                <div className="tf-field">
                    <label className="tf-label">Priority <span className="tf-required">*</span></label>
                    <select
                        className="tf-input tf-select"
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        disabled={disabled || loading}
                    >
                        <option value="HIGH">🔴 High</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="LOW">🟢 Low</option>
                    </select>
                </div>

                <div className={`tf-field ${errors.estimatedTimeMinutes ? "tf-field--error" : ""}`}>
                    <label className="tf-label">Est. Minutes <span className="tf-required">*</span></label>
                    <input
                        className="tf-input"
                        type="number"
                        name="estimatedTimeMinutes"
                        placeholder="30"
                        value={form.estimatedTimeMinutes}
                        onChange={handleChange}
                        disabled={disabled || loading}
                        min={1}
                    />
                    {errors.estimatedTimeMinutes && (
                        <span className="tf-error-msg">{errors.estimatedTimeMinutes}</span>
                    )}
                </div>
            </div>

            {/* Date + Deadline */}
            <div className="tf-row">
                <div className={`tf-field ${errors.taskDate ? "tf-field--error" : ""}`}>
                    <label className="tf-label">Date <span className="tf-required">*</span></label>
                    <input
                        className="tf-input"
                        type="date"
                        name="taskDate"
                        value={form.taskDate}
                        onChange={handleChange}
                        disabled={disabled || loading}
                    />
                    {errors.taskDate && <span className="tf-error-msg">{errors.taskDate}</span>}
                </div>

                <div className="tf-field">
                    <label className="tf-label">Deadline Time</label>
                    <input
                        className="tf-input"
                        type="time"
                        name="deadlineTime"
                        value={form.deadlineTime || ""}
                        onChange={handleChange}
                        disabled={disabled || loading}
                    />
                </div>
            </div>

            {/* Submit */}
            <button
                className="tf-submit"
                onClick={submit}
                disabled={disabled || loading}
            >
                {loading ? (
                    <><span className="tf-spinner" /> Adding Task…</>
                ) : (
                    <>+ Add Task</>
                )}
            </button>
        </div>
    );
};

export default TaskForm;