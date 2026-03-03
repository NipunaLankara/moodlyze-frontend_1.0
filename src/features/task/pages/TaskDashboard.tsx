import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import {
    getAllTasks,
    getTasksByStatus,
    updateTask,
    deleteTask,
} from "../services/task.service";

import type { TaskResponse, TaskStatus } from "../types/task.types";
import type { TaskFilter } from "../types/filter.types";
import "./css/TaskDashboard.css";
import Navbar from "../../../components/Navbar/Navbar.tsx";

const priorityConfig: Record<string, { className: string; icon: string }> = {
    HIGH:   { className: "pri--high",   icon: "🔴" },
    MEDIUM: { className: "pri--medium", icon: "🟡" },
    LOW:    { className: "pri--low",    icon: "🟢" },
};

const TaskDashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<TaskFilter>({ status: "PENDING", keyword: "", date: "" });

    const loadTasks = async () => {
        setLoading(true);
        try {
            const res = filter.status === "ALL"
                ? await getAllTasks()
                : await getTasksByStatus(filter.status as TaskStatus);
            setTasks(res.data.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFilter(prev => ({ ...prev, keyword: "", date: "" }));
        loadTasks();
    }, [filter.status]);

    const filteredTasks = tasks.filter(t => {
        const matchKeyword = !filter.keyword ||
            t.title.toLowerCase().includes(filter.keyword.toLowerCase()) ||
            t.description?.toLowerCase().includes(filter.keyword.toLowerCase());
        const matchDate = !filter.date || t.taskDate === filter.date;
        return matchKeyword && matchDate;
    });

    const markComplete = async (task: TaskResponse) => {
        if (task.status === "COMPLETED") return;
        await updateTask(task.id, { status: "COMPLETED" });
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: "COMPLETED" } : t));
    };

    const remove = async (id: number) => {
        if (!confirm("Delete this task?")) return;
        await deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const totalCount   = tasks.length;
    const pendingCount = tasks.filter(t => t.status === "PENDING").length;
    const doneCount    = tasks.filter(t => t.status === "COMPLETED").length;

    return (
        <div className="td-shell">
            <Navbar />

            <div className="td-body">

                {/* Header */}
                <div className="td-header">
                    <div>
                        <h1 className="td-header__title">All Tasks</h1>
                        <p className="td-header__sub">Browse, filter and manage everything</p>
                    </div>
                    <button className="td-new-btn" onClick={() => navigate("/tasks/add")}>
                        + New Task
                    </button>
                </div>

                {/* Summary chips */}
                <div className="td-summary">
                    <div className="td-chip td-chip--all">
                        <span className="td-chip__num">{totalCount}</span>
                        <span className="td-chip__lbl">Total</span>
                    </div>
                    <div className="td-chip td-chip--pending">
                        <span className="td-chip__num">{pendingCount}</span>
                        <span className="td-chip__lbl">Pending</span>
                    </div>
                    <div className="td-chip td-chip--done">
                        <span className="td-chip__num">{doneCount}</span>
                        <span className="td-chip__lbl">Completed</span>
                    </div>
                </div>

                {/* Filter bar */}
                <div className="td-filter-bar">
                    {/* Status tabs */}
                    <div className="td-tabs">
                        {(["ALL", "PENDING", "COMPLETED"] as const).map(s => (
                            <button
                                key={s}
                                className={`td-tab ${filter.status === s ? "td-tab--active" : ""}`}
                                onClick={() => setFilter({ status: s, keyword: "", date: "" })}
                            >
                                {s === "ALL" ? "All" : s === "PENDING" ? "🕐 Pending" : "✅ Completed"}
                            </button>
                        ))}
                    </div>

                    <div className="td-filter-inputs">
                        <div className="td-search-wrap">
                            <span className="td-search-icon">🔍</span>
                            <input
                                className="td-input"
                                placeholder="Search tasks…"
                                value={filter.keyword}
                                onChange={e => setFilter({ ...filter, keyword: e.target.value })}
                            />
                        </div>
                        <input
                            className="td-input td-date-input"
                            type="date"
                            value={filter.date}
                            onChange={e => setFilter({ ...filter, date: e.target.value })}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="td-list-section">
                    <div className="td-list-header">
                        <span className="td-list-count">
                            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
                        </span>
                        {(filter.keyword || filter.date) && (
                            <button
                                className="td-clear-btn"
                                onClick={() => setFilter(prev => ({ ...prev, keyword: "", date: "" }))}
                            >
                                ✕ Clear filters
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="td-loading">
                            <div className="td-loading__ring" />
                            <p>Loading tasks…</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="td-empty">
                            <span className="td-empty__icon">🗂</span>
                            <h3>No tasks found</h3>
                            <p>Try adjusting your filters or add a new task.</p>
                        </div>
                    ) : (
                        <div className="td-list">
                            {filteredTasks.map((task, i) => {
                                const p = priorityConfig[task.priority] || priorityConfig.MEDIUM;
                                const isDone = task.status === "COMPLETED";

                                return (
                                    <div
                                        key={task.id}
                                        className={`td-card ${isDone ? "td-card--done" : ""}`}
                                        style={{ animationDelay: `${i * 0.05}s` }}
                                    >
                                        <div className={`td-card__stripe ${p.className}`} />

                                        <div className="td-card__body">
                                            <div className="td-card__top">
                                                <h4 className={`td-card__title ${isDone ? "td-card__title--done" : ""}`}>
                                                    {task.title}
                                                </h4>
                                                <div className="td-card__badges">
                                                    <span className={`td-badge ${p.className}`}>
                                                        {p.icon} {task.priority}
                                                    </span>
                                                    <span className={`td-status ${isDone ? "td-status--done" : "td-status--pending"}`}>
                                                        {isDone ? "✅ Done" : "🕐 Pending"}
                                                    </span>
                                                </div>
                                            </div>

                                            {task.description && (
                                                <p className="td-card__desc">{task.description}</p>
                                            )}

                                            <div className="td-card__meta">
                                                {task.taskDate && (
                                                    <span className="td-meta">📅 {task.taskDate}</span>
                                                )}
                                                {task.deadlineTime && (
                                                    <span className="td-meta">⏰ {task.deadlineTime}</span>
                                                )}
                                                {task.estimatedTimeMinutes && (
                                                    <span className="td-meta">⏱ {task.estimatedTimeMinutes} min</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="td-card__actions">
                                            {!isDone ? (
                                                <button
                                                    className="td-btn td-btn--complete"
                                                    onClick={() => markComplete(task)}
                                                    title="Mark complete"
                                                >✓</button>
                                            ) : (
                                                <button className="td-btn td-btn--done" disabled>✓</button>
                                            )}
                                            <button
                                                className="td-btn td-btn--edit"
                                                onClick={() => navigate(`/tasks/edit/${task.id}`)}
                                                title="Edit"
                                            >✏️</button>
                                            <button
                                                className="td-btn td-btn--delete"
                                                onClick={() => remove(task.id)}
                                                title="Delete"
                                            >🗑</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDashboard;