import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    teamId: string | null;
}

export default function CreateTeam() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [adminId, setAdminId] = useState('');
    const [memberIds, setMemberIds] = useState<string[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            const token = await user?.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setUsers(data);
        }

        fetchUsers();
    }, [user]);

    const availableAdmins = users.filter(u => u.role === 'ADMIN' && !u.teamId);
    const availableMembers = users.filter(
        u => u._id !== adminId && !u.teamId
    );

    const toggleMember = (id: string) => {
        setMemberIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        const token = await user?.getIdToken();

        await fetch(`${import.meta.env.VITE_API_BASE_URL}/teams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description,
                adminId,
                memberIds,
            }),
        });

        setName('');
        setDescription('');
        setAdminId('');
        setMemberIds([]);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl mb-4">Create a New Team</h2>

            <input
                placeholder="Team Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 mb-2 block w-full"
            />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 mb-2 block w-full"
            />

            <select
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="border p-2 mb-4 block w-full"
            >
                <option value="">Select Admin</option>
                {availableAdmins.map((u) => (
                    <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                    </option>
                ))}
            </select>

            <div className="mb-4">
                <p className="font-semibold mb-2">Select Team Members:</p>
                {availableMembers.map((u) => (
                    u.role !== "ADMIN" && <label key={u._id} className="block mb-1">
                        <input
                            type="checkbox"
                            checked={memberIds.includes(u._id)}
                            onChange={() => toggleMember(u._id)}
                            className="mr-2"
                        />
                        {u.name} ({u.email}) - {u.role}
                    </label>
                ))}
            </div>

            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                Create Team
            </button>
        </div>
    );
}
