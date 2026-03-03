import { createContext, useContext, useState, useEffect } from "react";

type AuthUser = {
    token: string | null;
    email: string | null;
    role: string | null;
};

type AuthContextType = {
    user: AuthUser;
    login: (token: string, email: string, role: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser>({
        token: null,
        email: null,
        role: null,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");

        if (token) {
            setUser({ token, email, role });
        }
    }, []);

    const login = (token: string, email: string, role: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);

        setUser({ token, email, role });
    };

    const logout = () => {
        localStorage.clear();
        setUser({ token: null, email: null, role: null });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};