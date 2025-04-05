import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '../firebase/config';

const CitizenDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userInitial, setUserInitial] = useState('U');

  useEffect(() => {
    const fetchUserInitial = async () => {
      if (currentUser?.uid) {
        try {
          const snapshot = await get(ref(realtimeDb, `users/${currentUser.uid}`));
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const fullName = userData.fullName || userData.email || 'User';
            setUserInitial(fullName.trim().charAt(0).toUpperCase());
          } else {
            console.warn('No user data found in Firebase');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserInitial();
  }, [currentUser]);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <Sidebar userType="citizen" userName={userInitial} reportsCount={4} location="Gujarat" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <SearchBar />
          <button
            onClick={() => navigate('/citizen-dashboard/report-crime')}
            className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Report a Crime
          </button>
        </div>

        {/* Routed Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboard;

