import { useEffect, useState } from 'react';
import { auth } from '../firebase';

export function useUserRole() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRole() {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) return;

                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/role`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setRole(data.role);
            } catch (err) {
                console.error("Failed to fetch role:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchRole();
    }, []);

    return { role, loading };
}
