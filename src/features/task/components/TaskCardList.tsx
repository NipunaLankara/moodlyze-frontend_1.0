import type { TaskResponse } from "../types/task.types";

type Props = {
    tasks: TaskResponse[];
    onComplete: (task: TaskResponse) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
};

const TaskCardList = ({
                          tasks,
                          onComplete,
                          onDelete,
                          onEdit
                      }: Props) => {
    return (
        <div>
            <h3>Today’s Tasks ({tasks.length})</h3>

            {tasks.length === 0 ? (
                <p>No tasks added today</p>
            ) : (
                tasks.map(task => (
                    <div
                        key={task.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            marginBottom: "10px",
                            borderRadius: "8px",
                            background:
                                task.status === "COMPLETED"
                                    ? "#f0fdf4"
                                    : "#fff"
                        }}
                    >
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <p>
                            {task.priority} | {task.status}
                        </p>

                        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                            {task.status === "PENDING" ? (
                                <button onClick={() => onComplete(task)}>
                                    Complete
                                </button>
                            ) : (
                                <button disabled>
                                    Completed
                                </button>
                            )}

                            <button onClick={() => onEdit(task.id)}>
                                Edit
                            </button>

                            <button onClick={() => onDelete(task.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TaskCardList;