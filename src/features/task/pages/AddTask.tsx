import { useState } from "react";
import type { CreateTaskRequest } from "../types/task.types";
import { createTask } from "../services/task.service";

const AddTask = () => {
    const userId = 1; // later from AuthContext

    const [form, setForm] = useState<CreateTaskRequest>({
        title: "",
        description: "",
        priority: "MEDIUM",
        estimatedTimeMinutes: 30,
        taskDate: "",
    });

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

    const submit = async () => {
        await createTask(form, userId);
        alert("Task Created");
    };

    return (
        <div>
            <h2>Add Task</h2>

            <input name="title" placeholder="Title" onChange={handleChange} />
            <textarea name="description" placeholder="Description" onChange={handleChange} />

            <select name="priority" onChange={handleChange}>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
            </select>

            <input
                type="number"
                name="estimatedTimeMinutes"
                onChange={handleChange}
            />

            <input type="date" name="taskDate" onChange={handleChange} />
            <input type="time" name="deadlineTime" onChange={handleChange} />

            <button onClick={submit}>Add Task</button>
        </div>
    );
};

export default AddTask;
