import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../contexts/AuthContext';

const CitizenDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar
        userType="citizen"
        userName={currentUser?.displayName ?? "Anon"}
        reportsCount={4}
      />
      
      <div className="flex-1">
        <SearchBar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboard;