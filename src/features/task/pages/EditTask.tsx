import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask } from "../services/task.service";
import type { UpdateTaskRequest } from "../types/task.types";
import "./css/EditTask.css";
import Navbar from "../../../components/Navbar/Navbar.tsx";

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<UpdateTaskRequest>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

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
            setSaved(true);
            setTimeout(() => navigate("/tasks"), 1200);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="et-shell">
            <Navbar />
            <div className="et-body">

                {/* Back breadcrumb */}
                <button className="et-back" onClick={() => navigate("/tasks")}>
                    ← Back to tasks
                </button>

                <div className="et-card">
                    {/* Header */}
                    <div className="et-card__header">
                        <div className="et-card__header-icon">✏️</div>
                        <div>
                            <h1 className="et-card__title">Edit Task</h1>
                            <p className="et-card__sub">Update the details below and save</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="et-loading">
                            <div className="et-loading__ring" />
                            <p>Loading task…</p>
                        </div>
                    ) : (
                        <>
                            {saved && (
                                <div className="et-success-banner">
                                    ✅ Saved! Redirecting…
                                </div>
                            )}

                            <div className="et-form">
                                {/* Title */}
                                <div className="et-field et-field--full">
                                    <label className="et-label">Title <span className="et-req">*</span></label>
                                    <input
                                        className="et-input"
                                        name="title"
                                        placeholder="Task title"
                                        value={form.title || ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Description */}
                                <div className="et-field et-field--full">
                                    <label className="et-label">Description</label>
                                    <textarea
                                        className="et-input et-textarea"
                                        name="description"
                                        placeholder="Add more details…"
                                        value={form.description || ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Priority + Status */}
                                <div className="et-field">
                                    <label className="et-label">Priority <span className="et-req">*</span></label>
                                    <select className="et-input et-select" name="priority" value={form.priority || ""} onChange={handleChange}>
                                        <option value="HIGH">🔴 High</option>
                                        <option value="MEDIUM">🟡 Medium</option>
                                        <option value="LOW">🟢 Low</option>
                                    </select>
                                </div>

                                <div className="et-field">
                                    <label className="et-label">Status</label>
                                    <select className="et-input et-select" name="status" value={form.status || ""} onChange={handleChange}>
                                        <option value="PENDING">🕐 Pending</option>
                                        <option value="COMPLETED">✅ Completed</option>
                                    </select>
                                </div>

                                {/* Est. minutes + Deadline */}
                                <div className="et-field">
                                    <label className="et-label">Estimated Minutes</label>
                                    <input
                                        className="et-input"
                                        type="number"
                                        name="estimatedTimeMinutes"
                                        placeholder="30"
                                        value={form.estimatedTimeMinutes || ""}
                                        onChange={handleChange}
                                        min={1}
                                    />
                                </div>

                                <div className="et-field">
                                    <label className="et-label">Deadline Time</label>
                                    <input
                                        className="et-input"
                                        type="time"
                                        name="deadlineTime"
                                        value={form.deadlineTime || ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Date — full width */}
                                <div className="et-field et-field--full">
                                    <label className="et-label">Task Date</label>
                                    <input
                                        className="et-input"
                                        type="date"
                                        name="taskDate"
                                        value={form.taskDate || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="et-actions">
                                <button className="et-btn-cancel" onClick={() => navigate("/tasks")}>
                                    Cancel
                                </button>
                                <button className="et-btn-save" onClick={submit} disabled={saving || saved}>
                                    {saving ? (
                                        <><span className="et-spinner" /> Saving…</>
                                    ) : saved ? "✅ Saved!" : "Save Changes"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditTask;