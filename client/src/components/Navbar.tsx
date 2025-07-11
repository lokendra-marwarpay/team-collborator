import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const { logout, currentUser, role } = useAuth();
    const [isLogout, setIsLogout] = useState<boolean>(false)
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        setIsLogout(true);
        navigate('/login');
    };

    useEffect(() => {
        if (!location.pathname.includes("projects")) {
            // socket.disconnect()
        }
    }, [location.pathname])

    return (
        <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <Link to={(!isLogout && currentUser) ? "/dashboard" : '/login'} className="text-xl font-bold hover:text-gray-300">
                    TeamCollab
                </Link>
                {(!isLogout && currentUser) && <Link to="/dashboard" className="hover:text-gray-300">
                    Home
                </Link>}
                {role === "ADMIN" && <Link to="/team" className="hover:text-gray-300">
                    Create Team
                </Link>}
            </div>

            <div className="flex items-center space-x-4">
                {(!isLogout && currentUser) && (
                    <span className="text-sm text-gray-300 hidden sm:block">
                        {currentUser.email}
                    </span>
                )}
                {(!isLogout && currentUser) && <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm"
                >
                    Logout
                </button>}
            </div>
        </nav>
    );
};

export default Navbar;
