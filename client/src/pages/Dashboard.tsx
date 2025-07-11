import { useEffect, useState } from 'react';
import axios from '../utils/axios.ts';
import { Link } from 'react-router-dom';

interface Team {
    _id: string;
    name: string;
    description?: string;
    adminId?: {
        name: string;
        email: string;
    };
}

export default function Dashboard() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTeams() {
            try {
                const res = await axios.get('/teams');
                setTeams(res.data);
            } catch (err) {
                console.error('Error fetching teams:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchTeams();
    }, []);

    if (loading) return <div className="p-4">Loading teams...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Team Dashboard</h1>

            {teams.length === 0 ? (
                <p>No teams available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map((team) => (
                        <Link to={`/teams/${team._id}`} key={team._id}>
                            <div className="border rounded p-4 shadow hover:bg-gray-50 transition cursor-pointer">
                                <h2 className="text-xl font-bold">{team.name}</h2>
                                {team.description && <p className="text-gray-600 mt-1">{team.description}</p>}
                                {team.adminId && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Admin: {team.adminId.name} ({team.adminId.email})
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}

                </div>
            )}
        </div>
    );
}
