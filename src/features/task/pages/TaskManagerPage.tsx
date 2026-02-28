import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TaskForm from "../components/TaskForm";
import TaskCardList from "../components/TaskCardList";
import EmotionDetector from "../../emotion/components/EmotionDetector";


import {
    getAllTasks,
    updateTask,
    deleteTask,
} from "../services/task.service";

import { processAnalysis } from "../../analyze/services/analyze.service";
import type { TaskResponse } from "../types/task.types";
import "./css/TaskManagerPage.css";
import Navbar from "../../../components/Navbar/Navbar.tsx";

const MAX_TASKS_PER_DAY = 15;

const TaskManagerPage = () => {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const res = await getAllTasks();
            setTasks(res.data.data);
        } catch (err) {
            console.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTasks(); }, []);

    const todayPendingTasks = tasks.filter(t => {
        if (!t.taskDate) return false;
        const taskDateObj = new Date(t.taskDate);
        const todayObj = new Date();
        return (
            taskDateObj.getFullYear() === todayObj.getFullYear() &&
            taskDateObj.getMonth() === todayObj.getMonth() &&
            taskDateObj.getDate() === todayObj.getDate() &&
            t.status.toUpperCase() === "PENDING"
        );
    });

    const completedToday = tasks.filter(t => {
        if (!t.taskDate) return false;
        const taskDateObj = new Date(t.taskDate);
        const todayObj = new Date();
        return (
            taskDateObj.getFullYear() === todayObj.getFullYear() &&
            taskDateObj.getMonth() === todayObj.getMonth() &&
            taskDateObj.getDate() === todayObj.getDate() &&
            t.status.toUpperCase() === "COMPLETED"
        );
    });

    const handleTaskAdded = (newTask: TaskResponse) => {
        setTasks(prev => [newTask, ...prev]);
        setShowForm(false);
    };

    const markComplete = async (task: TaskResponse) => {
        if (task.status === "COMPLETED") return;
        try {
            await updateTask(task.id, { status: "COMPLETED" });
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: "COMPLETED" } : t));
        } catch (err) {
            alert("Failed to update task");
        }
    };

    const remove = async (id: number) => {
        if (!confirm("Delete task?")) return;
        try {
            await deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert("Failed to delete task");
        }
    };

    const editTask = (id: number) => navigate(`/tasks/edit/${id}`);

    const progressPct = Math.round((completedToday.length / (completedToday.length + todayPendingTasks.length || 1)) * 100);
    const limitReached = todayPendingTasks.length >= MAX_TASKS_PER_DAY;

    const greetingHour = new Date().getHours();
    const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";
    const userEmail = localStorage.getItem("email") || "there";
    const firstName = userEmail.split("@")[0];

    return (
        <div className="tm-shell">
            <Navbar />

            <div className="tm-body">

                {/* ── HEADER BAND ── */}
                <div className="tm-header">
                    <div className="tm-header__left">
                        <p className="tm-header__greeting">{greeting}, <strong>{firstName}</strong> 👋</p>
                        <h1 className="tm-header__title">Task Dashboard</h1>
                        <p className="tm-header__date">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </p>
                    </div>

                    <div className="tm-header__right">
                        <button
                            className={`tm-add-btn ${limitReached ? "tm-add-btn--disabled" : ""}`}
                            onClick={() => !limitReached && setShowForm(v => !v)}
                            disabled={limitReached}
                        >
                            <span className="tm-add-btn__icon">{showForm ? "✕" : "+"}</span>
                            {showForm ? "Cancel" : "Add Task"}
                        </button>
                    </div>
                </div>

                {/* ── STATS ROW ── */}
                <div className="tm-stats">
                    <div className="tm-stat tm-stat--blue">
                        <div className="tm-stat__icon">📋</div>
                        <div>
                            <div className="tm-stat__value">{todayPendingTasks.length}</div>
                            <div className="tm-stat__label">Pending today</div>
                        </div>
                    </div>
                    <div className="tm-stat tm-stat--green">
                        <div className="tm-stat__icon">✅</div>
                        <div>
                            <div className="tm-stat__value">{completedToday.length}</div>
                            <div className="tm-stat__label">Completed today</div>
                        </div>
                    </div>
                    <div className="tm-stat tm-stat--purple">
                        <div className="tm-stat__icon">📦</div>
                        <div>
                            <div className="tm-stat__value">{tasks.length}</div>
                            <div className="tm-stat__label">Total tasks</div>
                        </div>
                    </div>

                    {/* Progress bar stat */}
                    <div className="tm-stat tm-stat--progress">
                        <div className="tm-stat__progress-label">
                            <span>Today's Progress</span>
                            <span className="tm-stat__pct">{progressPct}%</span>
                        </div>
                        <div className="tm-stat__bar-track">
                            <div className="tm-stat__bar-fill" style={{ width: `${progressPct}%` }} />
                        </div>
                        <div className="tm-stat__limit-text">
                            {todayPendingTasks.length} / {MAX_TASKS_PER_DAY} slots used
                            {limitReached && <span className="tm-stat__limit-badge">Limit reached</span>}
                        </div>
                    </div>
                </div>

                {/* ── TASK FORM (collapsible) ── */}
                <div className={`tm-form-panel ${showForm ? "tm-form-panel--open" : ""}`}>
                    {showForm && (
                        <div className="tm-form-inner">
                            <TaskForm
                                onTaskAdded={handleTaskAdded}
                                disabled={limitReached}
                            />
                        </div>
                    )}
                </div>

                {/* ── MAIN CONTENT ── */}
                <div className="tm-content">

                    {/* Task list section */}
                    <div className="tm-section">
                        <div className="tm-section__header">
                            <h2 className="tm-section__title">
                                📌 Today's Pending Tasks
                                {todayPendingTasks.length > 0 && (
                                    <span className="tm-section__count">{todayPendingTasks.length}</span>
                                )}
                            </h2>

                            {/* ANALYZE button */}
                            {todayPendingTasks.length > 0 && (
                                <button
                                    className={`tm-analyze-btn ${analyzing ? "tm-analyze-btn--loading" : ""}`}
                                    onClick={() => setAnalyzing(true)}
                                    disabled={analyzing}
                                >
                                    {analyzing ? (
                                        <>
                                            <span className="tm-spinner" />
                                            Analyzing…
                                        </>
                                    ) : (
                                        <>🧠 Analyze Tasks</>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Emotion detector (invisible, triggers on analyze click) */}
                        {analyzing && (
                            <EmotionDetector
                                mode="AFTER"
                                onDetected={async () => {
                                    try {
                                        const res = await processAnalysis();
                                        const data = res.data.data;
                                        if (data.state === "REST_REQUIRED") {
                                            navigate("/analyze/rest", { state: data });
                                        } else {
                                            navigate("/analyze/schedule", { state: data });
                                        }
                                    } catch (err) {
                                        alert("Analysis failed");
                                    } finally {
                                        setAnalyzing(false);
                                    }
                                }}
                            />
                        )}

                        {loading ? (
                            <div className="tm-loading">
                                <div className="tm-loading__spinner" />
                                <p>Loading your tasks…</p>
                            </div>
                        ) : todayPendingTasks.length === 0 ? (
                            <div className="tm-empty">
                                <span className="tm-empty__icon">🎉</span>
                                <h3>All clear for today!</h3>
                                <p>No pending tasks. Add one to get started.</p>
                                {!showForm && (
                                    <button className="tm-add-btn" onClick={() => setShowForm(true)}>
                                        + Add your first task
                                    </button>
                                )}
                            </div>
                        ) : (
                            <TaskCardList
                                tasks={todayPendingTasks}
                                onComplete={markComplete}
                                onDelete={remove}
                                onEdit={editTask}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskManagerPage;