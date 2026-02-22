// import { useEffect, useState } from "react";
// import type { TaskResponse } from "../types/task.types";
// import {
//     getAllTasks,
//     updateTask,
//     deleteTask,
// } from "../services/task.service";
//
// const TaskList = () => {
//     const userId = 1;
//     const [tasks, setTasks] = useState<TaskResponse[]>([]);
//
//     useEffect(() => {
//         getAllTasks().then(res => {
//             setTasks(res.data.data);
//         });
//     }, [userId]);
//
//     const markCompleted = async (id: number) => {
//         await updateTask(id, { status: "COMPLETED" });
//         setTasks(prev =>
//             prev.map(t =>
//                 t.id === id ? { ...t, status: "COMPLETED" } : t
//             )
//         );
//     };
//
//     const remove = async (id: number) => {
//         await deleteTask(id,);
//         setTasks(prev => prev.filter(t => t.id !== id));
//     };
//
//     return (
//         <div>
//             <h2>My Tasks</h2>
//
//             {tasks.map(task => (
//                 <div key={task.id}>
//                     <h4>{task.title}</h4>
//                     <p>{task.description}</p>
//                     <p>
//                         {task.priority} | {task.status}
//                     </p>
//
//                     {task.status === "PENDING" && (
//                         <button onClick={() => markCompleted(task.id)}>
//                             Complete
//                         </button>
//                     )}
//
//                     <button onClick={() => remove(task.id)}>Delete</button>
//                 </div>
//             ))}
//         </div>
//     );
// };
//
// export default TaskList;
