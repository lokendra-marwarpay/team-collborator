import { useEffect, useState } from 'react';
import { getIdToken } from 'firebase/auth';
import { auth } from '../firebase';

export function useFetchRole() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRole() {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const token = await getIdToken(user);

                const res = await fetch('http://localhost:5000/api/users/role', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch role');
                const data = await res.json();

                setRole(data.role); // { role: "ADMIN" }
            } catch (err) {
                console.error('Error fetching role:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchRole();
    }, []);

    return { role, loading };
}
