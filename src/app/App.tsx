import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import MainLayout from "./MainLayout";
import EditTask from "../features/task/pages/EditTask.tsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword/ForgotPassword.tsx";
import ResetPassword from "../features/auth/pages/ForgotPassword/ResetPassword.tsx";

/* Lazy pages */
const Home = lazy(() => import("../pages/Home"));
const SignIn = lazy(() => import("../features/auth/pages/SignIn/SignIn"));
const Register = lazy(() => import("../features/auth/pages/SignUp/SignUp"));
const VerifyOtp = lazy(() => import("../features/auth/pages/VerifyOtp/VerifyOtp"));

const UserProfile = lazy(() => import("../features/user/pages/UserProfile/UserProfile"));
const VerifyEmailChangeOtp = lazy(() => import("../features/user/pages/VerifyEmailChangeOtp/VerifyEmailChangeOtp"));

const AddTask = lazy(() => import("../features/task/pages/TaskManagerPage.tsx"));
const TaskDashboard = lazy(() => import("../features/task/pages/TaskDashboard"));

const Testing = lazy(() => import("../features/auth/pages/SignIn/Testing"));

const RestSuggestionPage = lazy(() => import("../features/analyze/pages/RestSuggestionPage"));
const SchedulePage = lazy(() => import("../features/analyze/pages/SchedulePage"));

/* Lazy pages */
const Verify2FA = lazy(() => import("../features/auth/pages/VerifyOtp/Verify2FA"));
// const ReminderPage = lazy(() =>
//     import("../features/reminder/pages/ReminderPage/ReminderPage")
// );

const ReminderCalendar = lazy(() => import("../features/reminder/pages/ReminderCalendar"));

const App = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/sign_up" element={<Register />} />
                <Route path="/verify_otp" element={<VerifyOtp />} />
                <Route path="/verify-2fa" element={<Verify2FA />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* PROTECTED AREA - layout with Navbar + Sidebar */}
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>

                    {/* USER ROUTES */}
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/verify-email-change" element={<VerifyEmailChangeOtp />} />

                    {/* TASK ROUTES */}
                    <Route path="/tasks" element={<TaskDashboard />} />
                    <Route path="/tasks/add" element={<AddTask />} />
                    <Route path="/tasks/edit/:id" element={<EditTask />} />

                    {/* ANALYSIS */}
                    <Route path="/analyze/rest" element={<RestSuggestionPage />} />
                    <Route path="/analyze/schedule" element={<SchedulePage />} />

                    {/*<Route path="/reminders" element={<ReminderPage />} />*/}
                    <Route path="/reminders" element={<ReminderCalendar />} />

                    {/* ADMIN ONLY */}
                    <Route
                        path="/testing"
                        element={
                            <RoleRoute roles={["ADMIN"]}>
                                <Testing />
                            </RoleRoute>
                        }
                    />

                </Route>

                {/* 404 */}
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </Suspense>
    );
};

export default App;