import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

const Navbar = () => {
  const { logout, currentUser, role } = useAuth();
  const [isLogout, setIsLogout] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setIsLogout(true);
    navigate("/login");
  };

  useEffect(() => {
    if (!location.pathname.includes("projects")) {
      // socket.disconnect()
    }
  }, [location.pathname]);

  return (
    <nav className="bg-blue-600 px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Section - Logo + Links */}
        <div className="flex items-center space-x-6">
          <Link
            to={!isLogout && currentUser ? "/dashboard" : "/login"}
            className="text-2xl font-bold tracking-wide text-white hover:text-blue-200 transition"
          >
            TeamCollab
          </Link>
        </div>

        {/* Right Section - User Info + Logout */}
        <div className="hidden md:flex items-center space-x-4">
          {!isLogout && currentUser && (
            <span className="text-white font-medium">{currentUser.email}</span>
          )}
          {!isLogout && currentUser && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-200 text-white px-4 py-1 rounded-md text-sm font-medium transition"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none text-white"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-3 bg-blue-700 border rounded-lg p-4 shadow-md">
          {/* {!isLogout && currentUser && (
            <Link
              to="/dashboard"
              className="block text-white font-medium hover:text-blue-200 transition"
            >
              Home
            </Link>
          )}
          {role === "ADMIN" && (
            <Link
              to="/team"
              className="block text-white font-medium hover:text-blue-200 transition"
            >
              Create Team
            </Link>
          )} */}

          {!isLogout && currentUser && (
            <>
              <p className="text-white text-sm">{currentUser.email}</p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-200 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
