import { useState } from "react";
import type { CreateTaskRequest } from "../types/task.types";
import { createTask } from "../services/task.service";

const initialFormState: CreateTaskRequest = {
    title: "",
    description: "",
    priority: "MEDIUM",
    estimatedTimeMinutes: 30,
    taskDate: "",
};

const AddTask = () => {
    const userId = 1;

    const [form, setForm] = useState<CreateTaskRequest>(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        if (name === "estimatedTimeMinutes") {
            setForm(prev => ({
                ...prev,
                estimatedTimeMinutes: Number(value),
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

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

    const submit = async () => {
        if (!validateForm()) return;

        try {
            await createTask(form, userId);
            alert("Task added successfully ✅");
            setForm(initialFormState);
            setErrors({});
        } catch (error) {
            alert("Failed to add task ❌");
        }
    };

    return (
        <div>
            <h2>Add Task</h2>

            <input
                name="title"
                value={form.title}
                placeholder="Title"
                onChange={handleChange}
            />
            {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}

            <textarea
                name="description"
                value={form.description}
                placeholder="Description"
                onChange={handleChange}
            />

            <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
            >
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
            </select>

            <input
                type="number"
                name="estimatedTimeMinutes"
                value={form.estimatedTimeMinutes}
                onChange={handleChange}
            />
            {errors.estimatedTimeMinutes && (
                <p style={{ color: "red" }}>{errors.estimatedTimeMinutes}</p>
            )}

            <input
                type="date"
                name="taskDate"
                value={form.taskDate}
                onChange={handleChange}
            />
            {errors.taskDate && (
                <p style={{ color: "red" }}>{errors.taskDate}</p>
            )}

            <input
                type="time"
                name="deadlineTime"
                value={form.deadlineTime || ""}
                onChange={handleChange}
            />

            <button onClick={submit}>Add Task</button>
        </div>
    );
};

export default AddTask;
