import { useEffect, useState } from "react";
import axios from "../utils/axios.ts";
import { Link } from "react-router-dom";

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
        const res = await axios.get("/teams");
        setTeams(res.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-700">
        Loading teams...
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Heading + Add Team */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 sm:mb-12 lg:mb-16">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-700 text-center sm:text-left">
          🚀 Team Dashboard
        </h1>
        <Link
          to="/team"
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
        >
          + Add Team
        </Link>
      </div>

      {teams.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base">
          No teams available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {teams.map((team, index) => (
            <Link to={`/teams/${team._id}`} key={team._id}>
              <div className="relative bg-white rounded-3xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer p-6 sm:p-8 flex flex-col justify-between h-full">
                
                {/* Numbered Circle */}
                <div className="absolute -top-4 -left-4 bg-indigo-600 text-white font-bold w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full shadow-md text-sm sm:text-base lg:text-lg">
                  {index + 1}
                </div>

                {/* Card Content */}
                <div className="text-center mt-6 sm:mt-8">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-700 mb-2 sm:mb-3">
                    {team.name}
                  </h2>

                  {team.description && (
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      {team.description.length > 100
                        ? team.description.slice(0, 100) + "..."
                        : team.description}
                    </p>
                  )}
                </div>

                {team.adminId && (
                  <div className="mt-4 sm:mt-6 text-gray-700 space-y-1 sm:space-y-2 text-center">
                    <p className="flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg">
                      <span>👤</span>
                      <span className="font-medium">{team.adminId.name}</span>
                    </p>
                    <p className="flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg">
                      <span>📧</span>
                      <span>{team.adminId.email}</span>
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
