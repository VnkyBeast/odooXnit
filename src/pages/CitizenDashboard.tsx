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

  const [userData, setUserData] = useState({
    userInitial: 'U',
    userName: 'User',
    memberSince: '',
    reportsCount: 0,
    location: 'Unknown',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;

      try {
        const userRef = ref(realtimeDb, `users/${currentUser.uid}`);
        const userSnap = await get(userRef);

        const userInfo = userSnap.val();
        const fullName = userInfo?.fullName || currentUser.email || 'User';
        const city = userInfo?.city || 'Unknown';
        const createdAt = userInfo?.createdAt || currentUser.metadata.creationTime;

        const reportsRef = ref(realtimeDb, `crimes`);
        const reportsSnap = await get(reportsRef);

        let count = 0;
        if (reportsSnap.exists()) {
          const reportsData = reportsSnap.val();
          count = Object.values(reportsData).filter((r: any) => r.uid === currentUser.uid).length;
        }

        setUserData({
          userInitial: fullName.trim().charAt(0).toUpperCase(),
          userName: fullName,
          memberSince: new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          reportsCount: count,
          location: city,
        });
      } catch (err) {
        console.error('Error loading user dashboard info:', err);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar
        userType="citizen"
        userInitial={userData.userInitial}
        userName={userData.userName}
        reportsCount={userData.reportsCount}
        memberSince={userData.memberSince}
        location={userData.location}
      />

      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-800 bg-gray-900">
          <SearchBar />
        </div>

        <div className="p-4 border-b border-gray-800 flex justify-end">
          <button
            onClick={() => navigate('/citizen-dashboard/report-crime')}
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            Report a Crime
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboard;
