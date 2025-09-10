/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { auth } from '../firebase';
import { PencilIcon, TrashIcon, UserMinusIcon } from '@heroicons/react/24/outline';

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
  const [projects, setProjects] = useState<any[]>([]);
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
    location.reload();
  };

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm('Remove this member from the team?')) return;
    await axios.delete(`/users/${userId}/team`);
    location.reload();
  };

  if (loading || !team)
    return (
      <div className="h-screen flex items-center justify-center text-gray-700">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      {/* Team Header */}
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-8">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-3">{team.name}</h1>
        {team.description && (
          <p className="text-center text-gray-600 mb-4">{team.description}</p>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg shadow-sm w-full sm:w-auto text-center font-medium">
            Admin: {team.adminId?.name} ({team.adminId?.email})
          </div>
          {currentUserRole === 'ADMIN' && (
            <button
              onClick={handleDeleteTeam}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <TrashIcon className="w-5 h-5" />
              Delete Team
            </button>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Team Members</h2>
        {team.members.length ? (
          <ul className="space-y-3">
            {team.members.map((m) => (
              <li
                key={m._id}
                className="flex justify-between items-center border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{m.name} ({m.email})</p>
                  <p className="text-sm text-gray-500">Role: {m.role}</p>
                </div>
                {currentUserRole === 'ADMIN' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditRole(m._id, m.role)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Role"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveMember(m._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove Member"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No members in this team.</p>
        )}
      </div>

      {/* Projects */}
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Projects</h2>

        {/* Add Project */}
        {(currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER') && (
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
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
                  fetchProjects();
                } catch (err) {
                  console.error(err);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
            >
              Add Project
            </button>
          </div>
        )}

        {/* Project List */}
        {projects.length ? (
          <ul className="space-y-3">
            {projects.map((proj: any) => (
              <li
                key={proj._id}
                className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center"
              >
                {editingProjectId === proj._id ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between w-full">
                    <input
                      className="border rounded px-2 py-1 w-full sm:w-auto focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <input
                      className="border rounded px-2 py-1 w-full sm:w-auto focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                        onClick={async () => {
                          await axios.put(`/projects/${proj._id}`, {
                            name: editName,
                            description: editDesc,
                          });
                          setEditingProjectId(null);
                          fetchProjects();
                        }}
                        title="Save"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                        onClick={() => setEditingProjectId(null)}
                        title="Cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center w-full">
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(`/projects/${proj._id}`)}
                    >
                      <h3 className="font-bold text-gray-800">{proj.name}</h3>
                      <p className="text-sm text-gray-500">{proj.description}</p>
                    </div>

                    {(currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER') && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingProjectId(proj._id);
                            setEditName(proj.name);
                            setEditDesc(proj.description);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Project"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete this project?')) {
                              await axios.delete(`/projects/${proj._id}`);
                              fetchProjects();
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Project"
                        >
                          <TrashIcon className="w-5 h-5" />
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
