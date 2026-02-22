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

const TaskDashboard = () => {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const [filter, setFilter] = useState<TaskFilter>({
        status: "PENDING",
        keyword: "",
        date: "",
    });

    /** LOAD TASKS */
    const loadTasks = async () => {
        setLoading(true);
        try {
            const res =
                filter.status === "ALL"
                    ? await getAllTasks()
                    : await getTasksByStatus(filter.status as TaskStatus);

            setTasks(res.data.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            keyword: "",
            date: ""
        }));
        loadTasks();
    }, [filter.status]);

    /** LOCAL FILTER */
    const filteredTasks = tasks.filter(t => {
        const matchKeyword =
            !filter.keyword ||
            t.title.toLowerCase().includes(filter.keyword.toLowerCase()) ||
            t.description?.toLowerCase().includes(filter.keyword.toLowerCase());

        const matchDate =
            !filter.date || t.taskDate === filter.date;

        return matchKeyword && matchDate;
    });

    /** MARK COMPLETE */
    const markComplete = async (task: TaskResponse) => {
        if (task.status === "COMPLETED") return;

        await updateTask(task.id, { status: "COMPLETED" });

        setTasks(prev =>
            prev.map(t =>
                t.id === task.id ? { ...t, status: "COMPLETED" } : t
            )
        );
    };

    /** DELETE */
    const remove = async (id: number) => {
        if (!confirm("Delete task?")) return;

        await deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    /** EDIT NAVIGATION */
    const editTask = (id: number) => {
        navigate(`/tasks/edit/${id}`);
    };

    return (
        <div className="dashboard-container">
            <h2>
                Task Dashboard ({filteredTasks.length})
            </h2>
            {/* FILTER BAR */}
            <div className="filter-bar">

                <select
                    value={filter.status}
                    onChange={e =>
                        setFilter({
                            status: e.target.value as any,
                            keyword: "",
                            date: "",
                        })
                    }
                >
                    <option value="ALL">ALL</option>
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                </select>

                <input
                    type="date"
                    value={filter.date}
                    onChange={e =>
                        setFilter({...filter, date: e.target.value})
                    }
                />

                <input
                    placeholder="Search..."
                    value={filter.keyword}
                    onChange={e =>
                        setFilter({...filter, keyword: e.target.value})
                    }
                />
            </div>

            {/* LIST */}
            {loading ? (
                <p>Loading...</p>
            ) : filteredTasks.length === 0 ? (
                <p className="empty-msg">
                    {filter.status === "COMPLETED"
                        ? "No completed tasks found"
                        : filter.status === "PENDING"
                            ? "No pending tasks found"
                            : "No tasks found"}
                </p>
            ) : (
                filteredTasks.map(task => (
                    <div key={task.id} className="task-card">
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>

                        <p>
                            {task.priority} | {task.status} | {task.taskDate}
                        </p>

                        <div className="task-actions">
                            {task.status === "PENDING" ? (
                                <button onClick={() => markComplete(task)}>
                                    Complete
                                </button>
                            ) : (
                                <button disabled>
                                    Completed
                                </button>
                            )}

                            <button onClick={() => editTask(task.id)}>
                                Edit
                            </button>

                            <button onClick={() => remove(task.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TaskDashboard;