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
  const availableMembers = users.filter(u => u._id !== adminId && !u.teamId);

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

    // Reset form
    setName('');
    setDescription('');
    setAdminId('');
    setMemberIds([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-700 mb-8">
          Create a New Team
        </h2>

        {/* Team Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Name
          </label>
          <input
            placeholder="Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none h-24 sm:h-28"
          />
        </div>

        {/* Admin Select */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Admin
          </label>
          <select
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Admin</option>
            {availableAdmins.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {/* Team Members */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">Select Team Members</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {availableMembers
              .filter(u => u.role !== "ADMIN")
              .map((u) => (
              <label
                key={u._id}
                className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-2 hover:bg-blue-50 transition"
              >
                <input
                  type="checkbox"
                  checked={memberIds.includes(u._id)}
                  onChange={() => toggleMember(u._id)}
                  className="mr-3 w-4 h-4 accent-blue-500"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{u.name}</p>
                  <p className="text-gray-500 text-xs">{u.email} - {u.role}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition"
        >
          Create Team
        </button>
      </div>
    </div>
  );
}
