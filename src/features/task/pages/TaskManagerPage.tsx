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

const MAX_TASKS_PER_DAY = 15;

const TaskManagerPage = () => {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);



    //Load Tasks
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

    useEffect(() => {
        loadTasks();
    }, []);

    // Filter Today Pending Tasks
    const todayPendingTasks = tasks.filter(t => {
        if (!t.taskDate) return false;

        // Convert to Date object (handles string or Date)
        const taskDateObj = new Date(t.taskDate);

        // Compare year, month, date with today
        const todayObj = new Date();
        return (
            taskDateObj.getFullYear() === todayObj.getFullYear() &&
            taskDateObj.getMonth() === todayObj.getMonth() &&
            taskDateObj.getDate() === todayObj.getDate() &&
            t.status.toUpperCase() === "PENDING"
        );
    });

    // Add Task
    const handleTaskAdded = (newTask: TaskResponse) => {
        setTasks(prev => [newTask, ...prev]);
    };

    // Complete Task
    const markComplete = async (task: TaskResponse) => {
        if (task.status === "COMPLETED") return;

        try {
            await updateTask(task.id, { status: "COMPLETED" });

            setTasks(prev =>
                prev.map(t =>
                    t.id === task.id
                        ? { ...t, status: "COMPLETED" }
                        : t
                )
            );
        } catch (err) {
            alert("Failed to update task");
        }
    };

    // Delete Task
    const remove = async (id: number) => {
        if (!confirm("Delete task?")) return;

        try {
            await deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert("Failed to delete task");
        }
    };

    // Edit Task
    const editTask = (id: number) => {
        navigate(`/tasks/edit/${id}`);
    };

    return (
        <div style={{ display: "flex", gap: "30px" }}>

            {/* LEFT SIDE */}
            <div style={{ flex: 1 }}>

                <TaskForm
                    onTaskAdded={handleTaskAdded}
                    disabled={todayPendingTasks.length >= MAX_TASKS_PER_DAY}
                />

                <p>
                    Today Pending: {todayPendingTasks.length} / {MAX_TASKS_PER_DAY}
                </p>

                {todayPendingTasks.length >= MAX_TASKS_PER_DAY && (
                    <p style={{ color: "red" }}>
                        Daily task limit reached
                    </p>
                )}

                {/* NALYZE BUTTON */}
                {todayPendingTasks.length > 0 && (
                    <button
                        onClick={() => setAnalyzing(true)}
                        style={{ marginTop: "20px" }}
                        disabled={analyzing}
                    >
                        {analyzing ? "Analyzing..." : "Analyze Today’s Tasks"}
                    </button>
                )}

                {/* ONLY ONE EmotionDetector */}
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
            </div>

            {/* RIGHT SIDE */}
            <div style={{ flex: 1 }}>
                {loading ? (
                    <p>Loading...</p>
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
    );
};

export default TaskManagerPage;