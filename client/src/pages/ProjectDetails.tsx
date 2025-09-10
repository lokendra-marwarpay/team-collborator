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
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Fetch project
  useEffect(() => {
    if (!id) return;
    axios.get(`/projects/${id}`).then(res => setProject(res.data)).catch(console.error);
  }, [id]);

  // Fetch tasks
  useEffect(() => {
    if (!id) return;
    axios.get(`/tasks/project/${id}`).then(res => setTasks(res.data)).catch(console.error);
  }, [id]);

  // Fetch team members
  useEffect(() => {
    if (!project?.teamId) return;
    axios.get(`/teams/${project.teamId}`).then(res => setTeamMembers(res.data.members)).catch(console.error);
  }, [project]);

  // Fetch messages
  useEffect(() => {
    if (!project?.teamId) return;
    axios.get(`/messages/team/${project.teamId}`).then(res => setMessages(res.data)).catch(console.error);
  }, [project]);

  // Socket join
  useEffect(() => {
    if (project?.teamId) socket.emit('joinTeam', project.teamId);
  }, [project]);

  useEffect(() => {
    const handleNewMessage = (msg: any) => setMessages(prev => [...prev, msg]);
    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, []);

  const canEditStatus = (task: any) => role === 'ADMIN' || role === 'MANAGER' || currentUser?._id === task.assignedTo?._id;

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post('/messages', { content: newMessage, teamId: project.teamId });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gray-50 min-h-screen">
      {/* Project Info */}
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-8">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-3">{project?.name || 'Project'}</h1>
        {project?.description && <p className="text-center text-gray-600">{project.description}</p>}
      </div>

      {/* Add Task */}
      {(role === 'ADMIN' || role === 'MANAGER') && (
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-8 flex flex-col sm:flex-row gap-3 items-center">
          <input
            placeholder="Task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            placeholder="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-auto"
          >
            <option value="">Assign to</option>
            {teamMembers.map(member => (
              <option key={member._id} value={member._id}>{member.name} ({member.email})</option>
            ))}
          </select>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
            onClick={async () => {
              if (!newTitle.trim() || !assignedTo) return alert('Title and assignee required.');
              await axios.post('/tasks', { title: newTitle, description: newDesc, projectId: id, assignedTo });
              setNewTitle(''); setNewDesc(''); setAssignedTo('');
              axios.get(`/tasks/project/${id}`).then(res => setTasks(res.data));
            }}
          >
            Add Task
          </button>
        </div>
      )}

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tasks.length ? tasks.map(task => (
          <div key={task._id} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{task.description}</p>
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{task.status}</span>
              <p className="text-sm text-gray-500 mt-1">Assigned to: {task.assignedTo?.name || 'Unassigned'}</p>
            </div>
            {canEditStatus(task) && (
              <div className="mt-2 flex justify-between items-center">
                <select
                  value={task.status}
                  onChange={async e => {
                    await axios.put(`/tasks/${task._id}`, { status: e.target.value });
                    axios.get(`/tasks/project/${id}`).then(res => setTasks(res.data));
                  }}
                  className="border px-2 py-1 rounded"
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button
                  onClick={async () => {
                    if (!window.confirm('Delete this task?')) return;
                    await axios.delete(`/tasks/${task._id}`);
                    axios.get(`/tasks/project/${id}`).then(res => setTasks(res.data));
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )) : <p className="text-gray-500 col-span-full">No tasks yet.</p>}
      </div>

      {/* Team Chat */}
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Team Chat</h2>
        <div className="h-64 overflow-y-auto border p-3 rounded bg-gray-50 mb-4">
          {messages.length === 0 && <p className="text-gray-500">No messages yet</p>}
          {messages.map(msg => (
            <div key={msg._id} className="mb-3">
              <div className="text-sm font-semibold">{msg.senderId?.name || 'Unknown'}</div>
              <div>{msg.content}</div>
              <div className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
