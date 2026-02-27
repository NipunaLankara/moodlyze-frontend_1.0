import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask } from "../services/task.service";
import type { UpdateTaskRequest } from "../types/task.types";

import "./css/EditTask.css";

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<UpdateTaskRequest>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadTask = async () => {
            try {
                const res = await getTaskById(Number(id));
                setForm(res.data.data);
            } finally {
                setLoading(false);
            }
        };
        loadTask();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = async () => {
        setSaving(true);
        try {
            await updateTask(Number(id), form);
            alert("Task updated successfully");
            navigate("/tasks");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="loading">Loading task...</p>;

    return (
        <div className="form-container">
            <h2>Edit Task</h2>

            <div className="form-group">
                <label>Title *</label>
                <input
                    name="title"
                    value={form.title || ""}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={form.description || ""}
                    onChange={handleChange}
                />
            </div>

            <div className="form-row">

                <div className="form-group">
                    <label>Priority *</label>
                    <select
                        name="priority"
                        value={form.priority || ""}
                        onChange={handleChange}
                    >
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select
                        name="status"
                        value={form.status || ""}
                        onChange={handleChange}
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                </div>

            </div>

            <div className="form-row">

                <div className="form-group">
                    <label>Estimated Minutes</label>
                    <input
                        type="number"
                        name="estimatedTimeMinutes"
                        value={form.estimatedTimeMinutes || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Deadline Time</label>
                    <input
                        type="time"
                        name="deadlineTime"
                        value={form.deadlineTime || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        name="taskDate"
                        value={form.taskDate || ""}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="form-actions">
                <button className="btn-secondary" onClick={() => navigate("/tasks")}>
                    Cancel
                </button>

                <button
                    className="btn-primary"
                    onClick={submit}
                    disabled={saving}
                >
                    {saving ? "Updating..." : "Update Task"}
                </button>
            </div>
        </div>
    );
};

export default EditTask;