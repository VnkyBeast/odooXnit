import { NavLink } from 'react-router-dom';
import { MapPin, FileText, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  userType: 'citizen' | 'law';
  userName: string;
  location: string;
  reportsCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ userName, reportsCount }) => {
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-gray-900 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-purple-400">CrimeSight</h1>
      </div>
      
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white font-medium">{userName.charAt(0)}</span>
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <div>
            <p className="text-gray-400 text-sm">Reports Filed</p>
            <p className="text-white font-medium">{reportsCount}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Member Since</p>
            <p className="text-white font-medium">March 2025</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <NavLink
          to="/crime-map"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg ${
              isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`
          }
        >
          <MapPin size={20} />
          <span>Crime Map</span>
        </NavLink>

        <NavLink
          to="/report-crime"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg mt-2 ${
              isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`
          }
        >
          <FileText size={20} />
          <span>Report Crime</span>
        </NavLink>

        <NavLink
          to="/my-reports"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg mt-2 ${
              isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`
          }
        >
          <FileText size={20} />
          <span>My Reports</span>
          {reportsCount > 0 && (
            <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              {reportsCount}
            </span>
          )}
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg ${
              isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`
          }
        >
          <Bell size={20} />
          <span>Notifications</span>
          <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
            3
          </span>
        </NavLink>

        <button
          onClick={logout}
          className="flex items-center space-x-3 p-3 rounded-lg mt-2 text-gray-400 hover:bg-gray-800 w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;