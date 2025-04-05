import { NavLink } from 'react-router-dom';
import { MapPin, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { auth, realtimeDb } from '../firebase/config';
import { ref, onValue } from 'firebase/database';

interface SidebarProps {
  userType: 'citizen' | 'law';
  location: string;
  memberSince: string;
  onClose?: () => void;
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  userType,
  location,
  memberSince,
  onClose,
  isOpen = true
}) => {
  const { logout } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);
  const [reportsCount, setReportsCount] = useState<number>(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !user.email) return;

    const userRef = ref(realtimeDb, 'users');
    onValue(userRef, (snapshot) => {
      const usersData = snapshot.val();
      for (const id in usersData) {
        if (usersData[id].email === user.email) {
          setUserName(usersData[id].fullName);
          break;
        }
      }
    });

    const crimesRef = ref(realtimeDb, 'crimes');
    onValue(crimesRef, (snapshot) => {
      const reportsData = snapshot.val();
      const count = Object.values(reportsData || {}).filter(
        (report: any) => report.email === user.email
      ).length;
      setReportsCount(count);
    });
  }, []);

  const user = auth.currentUser;
  const userEmail = user?.email ?? '';
  const userInitial = userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-purple-400">CrimeSight</h1>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-semibold text-white">
              {userInitial}
            </div>
            <div>
              <p className="text-white font-semibold">{userEmail}</p>
              {userName && (
                <p className="text-sm text-gray-400">{userName}</p>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Reports Filed</span>
              <span className="text-white">{reportsCount}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Member Since</span>
              <span className="text-white">{memberSince}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/citizen-dashboard/crime-map"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`
            }
          >
            <MapPin size={20} />
            <span>Crime Map</span>
          </NavLink>

          <NavLink
            to="/citizen-dashboard/report-crime"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`
            }
          >
            <FileText size={20} />
            <span>Report Crime</span>
          </NavLink>

          <NavLink
            to="/citizen-dashboard/my-reports"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg relative ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`
            }
          >
            <FileText size={20} />
            <span>My Reports</span>
            {reportsCount > 0 && (
              <span className="absolute right-4 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                {reportsCount}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 w-full"
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
