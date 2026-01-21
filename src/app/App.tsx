import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";

import SignIn from "../features/auth/pages/SignIn/SignIn";
import Register from "../features/auth/pages/SignUp/SignUp";
import VerifyOtp from "../features/auth/pages/VerifyOtp/VerifyOtp";
import Testing from "../features/auth/pages/SignIn/Testing";

import UserProfile from "../features/user/pages/UserProfile/UserProfile";
import VerifyEmailChangeOtp from "../features/user/pages/VerifyEmailChangeOtp/VerifyEmailChangeOtp";

import AddTask from "../features/task/pages/AddTask";
import TaskList from "../features/task/pages/TaskList";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            {/* Auth */}
            <Route path="/login" element={<SignIn />} />
            <Route path="/sign_up" element={<Register />} />
            <Route path="/verify_otp" element={<VerifyOtp />} />

            {/* User */}
            <Route path="/profile" element={<UserProfile />} />
            <Route
                path="/verify-email-change"
                element={<VerifyEmailChangeOtp />}
            />

            {/* Tasks */}
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/add" element={<AddTask />} />

            {/* Testing */}
            <Route path="/testing" element={<Testing />} />
        </Routes>
    );
};

export default App;
