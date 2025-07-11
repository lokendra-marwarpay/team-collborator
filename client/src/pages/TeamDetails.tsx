/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { auth } from '../firebase';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface Team {
    _id: string;
    name: string;
    description?: string;
    adminId?: User;
    members: User[];
}


export default function TeamDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState('');
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');


    const fetchProjects = async () => {
        try {
            const res = await axios.get(`/projects/team/${id}`);
            setProjects(res.data);
        } catch (err) {
            console.error('Error fetching projects:', err);
        }
    };

    useEffect(() => {
        if (id) fetchProjects();
    }, [id]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/teams/${id}`);
                setTeam(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchRole = async () => {
            const token = await auth.currentUser?.getIdToken();
            const res = await axios.get('/users/role', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrentUserRole(res.data.role);
        };

        fetchData();
        fetchRole();
    }, [id]);

    const handleDeleteTeam = async () => {
        if (!window.confirm('Delete this team permanently?')) return;
        await axios.delete(`/teams/${id}`);
        navigate('/dashboard');
    };

    const handleEditRole = async (userId: string, currentRole: string) => {
        const newRole = prompt('Enter new role (ADMIN, MANAGER, MEMBER):', currentRole);
        if (!newRole || newRole === currentRole) return;

        await axios.patch(`/users/${userId}`, { role: newRole });
        location.reload(); // simple refresh to re-fetch
    };

    const handleRemoveMember = async (userId: string) => {
        if (!window.confirm('Remove this member from the team?')) return;
        await axios.delete(`/users/${userId}/team`);
        location.reload();
    };

    if (loading || !team) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-2">{team.name}</h1>
            {team.description && <p className="mb-4 text-gray-600">{team.description}</p>}

            <div className="flex justify-between items-center mb-4">
                <p className="font-medium">Admin:</p>
                {currentUserRole === 'ADMIN' && (
                    <button onClick={handleDeleteTeam} className="text-red-600 border px-3 py-1 rounded hover:bg-red-50">
                        Delete Team
                    </button>
                )}
            </div>
            <div className="mb-6 border p-2 rounded bg-gray-50">
                {team.adminId?.name} ({team.adminId?.email})
            </div>

            <p className="font-medium mb-2">Members:</p>
            {team.members.length ? (
                <ul className="space-y-2">
                    {team.members.map((m) => (
                        <li key={m._id} className="border p-3 rounded flex justify-between items-center">
                            <div>
                                <p>{m.name} ({m.email})</p>
                                <p className="text-sm text-gray-500">Role: {m.role}</p>
                            </div>
                            {currentUserRole === 'ADMIN' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditRole(m._id, m.role)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit Role
                                    </button>
                                    <button
                                        onClick={() => handleRemoveMember(m._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">No other members</p>
            )}

            {/* Projects mapping */}

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Projects</h2>

                {currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER' ? (
                    <div className="mb-4 flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Project name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="border px-3 py-1 rounded w-full sm:w-auto"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={projectDesc}
                            onChange={(e) => setProjectDesc(e.target.value)}
                            className="border px-3 py-1 rounded w-full sm:w-auto"
                        />
                        <button
                            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                            onClick={async () => {
                                if (!projectName.trim()) return;
                                try {
                                    await axios.post('/projects', {
                                        name: projectName,
                                        description: projectDesc,
                                        teamId: id,
                                    });
                                    setProjectName('');
                                    setProjectDesc('');
                                    fetchProjects(); // refresh list
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                        >
                            Add Project
                        </button>
                    </div>
                ) : null}

                {projects.length ? (
                    <ul className="space-y-3">
                        {projects.map((proj: any) => (
                            <li key={proj._id} className="border p-3 rounded">
                                {editingProjectId === proj._id ? (
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
                                        <input
                                            className="border rounded px-2 py-1 w-full sm:w-auto"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />
                                        <input
                                            className="border rounded px-2 py-1 w-full sm:w-auto"
                                            value={editDesc}
                                            onChange={(e) => setEditDesc(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-green-600 text-white px-3 py-1 rounded"
                                                onClick={async () => {
                                                    await axios.put(`/projects/${proj._id}`, {
                                                        name: editName,
                                                        description: editDesc,
                                                    });
                                                    setEditingProjectId(null);
                                                    fetchProjects();
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
                                                onClick={() => setEditingProjectId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => navigate(`/projects/${proj._id}`)}
                                        >
                                            <h3 className="font-bold">{proj.name}</h3>
                                            <p className="text-sm text-gray-600">{proj.description}</p>
                                        </div>

                                        {(currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER') && (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        setEditingProjectId(proj._id);
                                                        setEditName(proj.name);
                                                        setEditDesc(proj.description);
                                                    }}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('Delete this project?')) {
                                                            await axios.delete(`/projects/${proj._id}`);
                                                            fetchProjects();
                                                        }
                                                    }}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}

                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No projects yet.</p>
                )}
            </div>


        </div>
    );
}
