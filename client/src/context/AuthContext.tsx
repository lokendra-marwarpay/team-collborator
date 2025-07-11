/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import type { User } from 'firebase/auth';

interface AuthContextProps {
    user: User | null;
    role: string | null;
    loading: boolean;
    logout: () => Promise<void>;
    currentUser: any;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    role: null,
    loading: true,
    logout: async () => { },
    currentUser: null
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            setUser(firebaseUser || null);

            if (firebaseUser) {
                const token = await firebaseUser.getIdToken();
                localStorage.setItem('token', token);

                try {
                    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/role`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const data = await res.json();
                    setRole(data.role || null);
                } catch (err) {
                    console.error('Failed to fetch role:', err);
                    setRole(null);
                }
            } else {
                setRole(null);
                localStorage.removeItem('token');
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const token = await auth.currentUser?.getIdToken();
            if (!token) return;

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const user = await res.json();
            setCurrentUser(user);
        };

        fetchUser();
    }, [auth.currentUser]);


    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, logout, currentUser }}>
            {children}
        </AuthContext.Provider>
    );
}
