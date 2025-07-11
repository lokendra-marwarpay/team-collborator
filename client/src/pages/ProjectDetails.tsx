/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import socket from '../utils/socket.ts';

const ProjectDetails = () => {
    const { role, currentUser } = useAuth();
    const { id } = useParams();

    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                console.error('Failed to load project', err);
            }
        };
        if (id) fetchProject();
    }, [id]);

    const fetchTeamMembers = async () => {
        try {
            const res = await axios.get(`/teams/${project.teamId}`);
            setTeamMembers(res.data.members);
        } catch (err) {
            console.error('Failed to fetch team members', err);
        }
    };
    useEffect(() => {
        if (project?.teamId) fetchTeamMembers();
    }, [project]);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`/tasks/project/${id}`);
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (id) fetchTasks();
    }, [id]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`/messages/team/${project.teamId}`);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        }
    };
    useEffect(() => {
        if (project?.teamId) fetchMessages();
    }, [project]);

    useEffect(() => {
        if (project?.teamId) {
            socket.emit('joinTeam', project.teamId);
        }
    }, [project]);

    useEffect(() => {
        const handleNewMessage = (msg: any) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, []);

    const canEditStatus = (task: any) =>
        role === 'ADMIN' || role === 'MANAGER' || currentUser?._id === task.assignedTo?._id;

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await axios.post('/messages', {
                content: newMessage,
                teamId: project.teamId,
            });
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message', err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Project Details</h1>

            <div className="bg-white shadow p-4 rounded mb-6">
                <h2 className="text-xl font-bold">{project?.name || 'Project'}</h2>
                <p className="text-gray-600">{project?.description}</p>
            </div>

            {(role === 'ADMIN' || role === 'MANAGER') && (
                <div className="mb-4 flex flex-col sm:flex-row gap-2">
                    <input
                        placeholder="Task title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="border px-3 py-1 rounded w-full sm:w-auto"
                    />
                    <input
                        placeholder="Description"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="border px-3 py-1 rounded w-full sm:w-auto"
                    />
                    <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="border px-3 py-1 rounded w-full sm:w-auto"
                        required
                    >
                        <option value="">Assign to</option>
                        {teamMembers.map((member: any) => (
                            <option key={member._id} value={member._id}>
                                {member.name} ({member.email})
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={async () => {
                            if (!newTitle.trim() || !assignedTo)
                                return alert('Title and assignee required.');
                            try {
                                await axios.post('/tasks', {
                                    title: newTitle,
                                    description: newDesc,
                                    projectId: id,
                                    assignedTo,
                                });
                                setNewTitle('');
                                setNewDesc('');
                                setAssignedTo('');
                                fetchTasks();
                            } catch (err) {
                                console.error(err);
                            }
                        }}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                        Add Task
                    </button>
                </div>
            )}

            {tasks.length > 0 ? (
                <ul className="space-y-3 mb-8">
                    {tasks.map((task: any) => (
                        <li key={task._id} className="border p-3 rounded flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{task.title}</h3>
                                <p className="text-sm text-gray-600">{task.description}</p>
                                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{task.status}</span>
                                <p className="text-sm text-gray-500">
                                    Assigned to: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                                </p>
                            </div>

                            {canEditStatus(task) && (
                                <div className="flex gap-2 items-center">
                                    <select
                                        value={task.status}
                                        onChange={async (e) => {
                                            await axios.put(`/tasks/${task._id}`, {
                                                status: e.target.value,
                                            });
                                            fetchTasks();
                                        }}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="todo">Todo</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Delete this task?')) {
                                                await axios.delete(`/tasks/${task._id}`);
                                                fetchTasks();
                                            }
                                        }}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500 mb-6">No tasks yet.</p>
            )}

            <div className="bg-white border rounded shadow p-4">
                <h2 className="text-xl font-bold mb-3">Team Chat</h2>
                <div className="h-64 overflow-y-auto border p-3 rounded bg-gray-50 mb-4">
                    {messages.length === 0 && <p className="text-gray-500">No messages yet</p>}
                    {messages.map((msg) => (
                        <div key={msg._id} className="mb-3">
                            <div className="text-sm font-semibold">{msg.senderId?.name || 'Unknown'}</div>
                            <div>{msg.content}</div>
                            <div className="text-xs text-gray-400">
                                {new Date(msg.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        className="flex-1 border px-3 py-2 rounded"
                        placeholder="Type a message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
