import { createContext, useContext, type ReactNode } from "react";
import { getUserId } from "@/lib/auth";

interface AuthContextType {
    userId: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const userId = getUserId();

    return (
        <AuthContext.Provider value={{ userId }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    };

    return context;
};