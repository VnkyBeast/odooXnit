import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '../firebase/config'; // ✅ Ensure correct name

const CitizenDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userInitial, setUserInitial] = useState("A");

  useEffect(() => {
    const fetchUserInitial = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const snapshot = await get(ref(realtimeDb, `users/${currentUser.uid}`));
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const fullName = userData.fullName || userData.email || "Anon";
            const firstInitial = fullName.trim().charAt(0).toUpperCase();
            setUserInitial(firstInitial);
          } else {
            console.warn("No data found for user in Realtime DB");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserInitial();
  }, [currentUser]);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar userType="citizen" userName={userInitial} reportsCount={4} />

      <div className="flex-1">
        <SearchBar />
        <main className="p-6">
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => navigate('/citizen-dashboard/report-crime')} // ✅ absolute path
              // ✅ Use relative path
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Report a Crime
            </button>
          </div>
          <Outlet /> {/* This will render CrimeMap or ReportCrime based on route */}
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboard;
