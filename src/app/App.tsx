import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../features/auth/pages/SignIn/SignIn.tsx";
import Register from "../features/auth/pages/SignUp/SignUp.tsx";
import VerifyOtp from "../features/auth/pages/VerifyOtp/VerifyOtp";
import Testing from "../features/auth/pages/SignIn/Testing.tsx";
import VerifyEmailChangeOtp from "../features/user/pages/VerifyEmailChangeOtp/VerifyEmailChangeOtp.tsx";

import UserProfile from "../features/user/pages/UserProfile/UserProfile.tsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/sign_up" element={<Register />} />
            <Route path="/verify_otp" element={<VerifyOtp />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route
                path="/verify-email-change"
                element={<VerifyEmailChangeOtp />}
            />

        </Routes>
    );
};

export default App;
