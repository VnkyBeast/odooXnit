import { NavLink } from 'react-router-dom';
import { MapPin, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  userType: 'citizen' | 'law';
  userInitial: string;
  userName: string;
  location: string;
  memberSince: string;
  reportsCount: number;
  onClose?: () => void;
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  userInitial,
  userName,
  location,
  memberSince,
  reportsCount,
  onClose,
  isOpen = true,
}) => {
  const { logout } = useAuth();

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50" onClick={onClose} />}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-gray-900 border-r border-gray-800 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-purple-500">CrimeSight</h1>
        </div>

        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl font-semibold">
              {userInitial}
            </div>
            <div>
              <p className="font-medium text-white">{userName}</p>
              <p className="text-sm text-gray-400">{location}</p>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Reports Filed</span>
              <span className="text-white">{reportsCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Member Since</span>
              <span className="text-white">{memberSince}</span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink
            to="/citizen-dashboard/crime-map"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg space-x-3 ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <MapPin size={20} />
            <span>Crime Map</span>
          </NavLink>

          <NavLink
            to="/citizen-dashboard/report-crime"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg space-x-3 ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <FileText size={20} />
            <span>Report Crime</span>
          </NavLink>

          <NavLink
            to="/citizen-dashboard/my-reports"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg space-x-3 ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <FileText size={20} />
            <span>My Reports</span>
            {reportsCount > 0 && (
              <span className="ml-auto bg-purple-500 px-2 py-0.5 text-xs rounded-full text-white">
                {reportsCount}
              </span>
            )}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full p-3 rounded-lg text-gray-300 hover:bg-gray-800"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
