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
  const [userName, setUserName] = useState('User');
  const [memberSince, setMemberSince] = useState('');
  const [reportsCount, setReportsCount] = useState(0);
  const [location, setLocation] = useState('Unknown');

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const userRef = ref(realtimeDb, `users/${currentUser.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            const fullName = userData.fullName || userData.email || 'User';
            const city = userData.city || 'Unknown';
            const createdAt = userData.createdAt || currentUser.metadata.creationTime;

            setUserInitial(fullName.trim().charAt(0).toUpperCase());
            setUserName(fullName);
            setLocation(city);
            setMemberSince(formatDate(createdAt));
          } else {
            console.warn('No user data found in Firebase');
          }

          // Fetch reports count
          const reportsRef = ref(realtimeDb, `crimes/${currentUser.uid}`);
          const reportsSnapshot = await get(reportsRef);
          if (reportsSnapshot.exists()) {
            setReportsCount(Object.keys(reportsSnapshot.val()).length);
          }
        } catch (error) {
          console.error('Error fetching user/dashboard data:', error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const formatDate = (firebaseDate: string) => {
    try {
      const date = new Date(firebaseDate);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar with user info */}
      <Sidebar
        userType="citizen"
        userName={userName}
        userInitial={userInitial}
        location={location}
        memberSince={memberSince}
        reportsCount={reportsCount}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <SearchBar />
          <button
            onClick={() => navigate('/citizen-dashboard/report-crime')}
            className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Report a Crime
          </button>
        </div>

        {/* Nested Route Content (like CrimeMap, MyReports, etc.) */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboard;
