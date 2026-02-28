import type { TaskResponse } from "../types/task.types";
import "./css/TaskCardList.css";

type Props = {
    tasks: TaskResponse[];
    onComplete: (task: TaskResponse) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
};

const priorityConfig: Record<string, { label: string; className: string; icon: string }> = {
    HIGH:   { label: "High",   className: "priority--high",   icon: "🔴" },
    MEDIUM: { label: "Medium", className: "priority--medium", icon: "🟡" },
    LOW:    { label: "Low",    className: "priority--low",    icon: "🟢" },
};

const TaskCardList = ({ tasks, onComplete, onDelete, onEdit }: Props) => {
    return (
        <div className="tcl-list">
            {tasks.length === 0 ? (
                <div className="tcl-empty">
                    <span className="tcl-empty__icon">📭</span>
                    <p>No tasks added today</p>
                </div>
            ) : (
                tasks.map((task, index) => {
                    const p = priorityConfig[task.priority] || priorityConfig.MEDIUM;
                    const isDone = task.status === "COMPLETED";

                    return (
                        <div
                            key={task.id}
                            className={`tcl-card ${isDone ? "tcl-card--done" : ""}`}
                            style={{ animationDelay: `${index * 0.06}s` }}
                        >
                            {/* Priority stripe */}
                            <div className={`tcl-card__stripe ${p.className}`} />

                            {/* Body */}
                            <div className="tcl-card__body">
                                <div className="tcl-card__top">
                                    <h4 className={`tcl-card__title ${isDone ? "tcl-card__title--done" : ""}`}>
                                        {task.title}
                                    </h4>
                                    <span className={`tcl-badge ${p.className}`}>
                                        {p.icon} {p.label}
                                    </span>
                                </div>

                                {task.description && (
                                    <p className="tcl-card__desc">{task.description}</p>
                                )}

                                <div className="tcl-card__meta">
                                    {task.taskDate && (
                                        <span className="tcl-meta-chip">📅 {task.taskDate}</span>
                                    )}
                                    {task.deadlineTime && (
                                        <span className="tcl-meta-chip">⏰ {task.deadlineTime}</span>
                                    )}
                                    {task.estimatedTimeMinutes && (
                                        <span className="tcl-meta-chip">⏱ {task.estimatedTimeMinutes} min</span>
                                    )}
                                    <span className={`tcl-status ${isDone ? "tcl-status--done" : "tcl-status--pending"}`}>
                                        {isDone ? "✅ Completed" : "🕐 Pending"}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="tcl-card__actions">
                                {!isDone ? (
                                    <button
                                        className="tcl-btn tcl-btn--complete"
                                        onClick={() => onComplete(task)}
                                        title="Mark complete"
                                    >
                                        ✓
                                    </button>
                                ) : (
                                    <button className="tcl-btn tcl-btn--done-icon" disabled title="Already completed">
                                        ✓
                                    </button>
                                )}
                                <button
                                    className="tcl-btn tcl-btn--edit"
                                    onClick={() => onEdit(task.id)}
                                    title="Edit task"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="tcl-btn tcl-btn--delete"
                                    onClick={() => onDelete(task.id)}
                                    title="Delete task"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default TaskCardList;