import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskCardList from "../components/TaskCardList";
import EmotionDetector from "../../emotion/components/EmotionDetector";
import { getAllTasks } from "../services/task.service";
import type { TaskResponse } from "../types/task.types";

import { updateTask, deleteTask } from "../services/task.service";
import { useNavigate } from "react-router-dom";

const MAX_TASKS_PER_DAY = 15;

const TaskManagerPage = () => {

    const navigate = useNavigate();

    const markComplete = async (task: TaskResponse) => {
        if (task.status === "COMPLETED") return;

        await updateTask(task.id, { status: "COMPLETED" });

        setTasks(prev =>
            prev.map(t =>
                t.id === task.id
                    ? { ...t, status: "COMPLETED" }
                    : t
            )
        );
    };

    const remove = async (id: number) => {
        if (!confirm("Delete task?")) return;

        await deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const editTask = (id: number) => {
        navigate(`/tasks/edit/${id}`);
    };
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [detectedEmotion, setDetectedEmotion] = useState("");

    const today = new Date().toISOString().split("T")[0];

    const loadTasks = async () => {
        setLoading(true);
        const res = await getAllTasks();
        setTasks(res.data.data);
        setLoading(false);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const todayPendingTasks = tasks.filter(t => {
        if (!t.taskDate) return false;

        const taskDate = String(t.taskDate).split("T")[0];

        return taskDate === today && t.status === "PENDING";
    });

    const handleTaskAdded = (newTask: TaskResponse) => {
        setTasks(prev => [newTask, ...prev]);
    };

    return (
        <div style={{ display: "flex", gap: "30px" }}>

            {/* LEFT SIDE - FORM */}
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

                {/* ANALYZE BUTTON */}
                {todayPendingTasks.length > 0 && (
                    <button
                        onClick={() => setAnalyzing(true)}
                        style={{ marginTop: "20px" }}
                    >
                        Analyze Today’s Tasks
                    </button>
                )}

                {analyzing && (
                    <EmotionDetector
                        mode="AFTER"
                        onDetected={(emotion) => {
                            setDetectedEmotion(emotion);
                            setAnalyzing(false);
                        }}
                    />
                )}

                {detectedEmotion && (
                    <p>
                        <strong>Detected Emotion:</strong> {detectedEmotion}
                    </p>
                )}
            </div>

            {/* RIGHT SIDE - TASK CARDS */}
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