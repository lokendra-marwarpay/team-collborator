/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getIdToken,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthPage() {
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      const user = auth.currentUser;
      if (user) {
        const token = await getIdToken(user);

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/users`,
          { name: isLogin ? "any" : name, email },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Side Image */}
      <div className="hidden lg:flex w-1/2 h-full bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center">
        <img
          src="https://thumbs.dreamstime.com/b/group-people-discussing-together-40797433.jpg"
          alt="Authentication Illustration"
          className="w-[80%] h-[80%] object-cover rounded-xl shadow-lg"
        />
      </div>

      {/* Right Side Form */}
      <div className="flex w-full lg:w-1/2 h-full items-center justify-center bg-gray-50 px-6 sm:px-10">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-6">
            {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md text-sm sm:text-base"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            {isLogin ? "No account yet?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-indigo-600 font-medium hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
