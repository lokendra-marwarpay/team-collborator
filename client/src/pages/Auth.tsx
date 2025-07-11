/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getIdToken } from "firebase/auth";
import axios from 'axios';

export default function AuthPage() {
    const [name, setName] = useState("")
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }

            const user = auth.currentUser;
            if (user) {
                const token = await getIdToken(user);

                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users`, { name: isLogin ? "any" : name, email }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                })
            }

            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80 space-y-4">
                <h2 className="text-xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {!isLogin && <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
                <p className="text-sm text-center">
                    {isLogin ? 'No account?' : 'Already have an account?'}{' '}
                    <button type="button" className="text-blue-500 underline" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </form>
        </div>
    );
}
