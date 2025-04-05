import { useEffect, useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { realtimeDb } from '../firebase/config';
import { ref, get } from 'firebase/database';

const SearchBar: React.FC = () => {
  const { currentUser } = useAuth();
  const [userInitial, setUserInitial] = useState<string>('A');

  useEffect(() => {
    const fetchUserInitial = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const snapshot = await get(ref(realtimeDb, `users/${currentUser.uid}`));
          if (snapshot.exists()) {
            const data = snapshot.val();
            const fullName: string = data.fullName || data.email || 'Anon';
            setUserInitial(fullName.trim().charAt(0).toUpperCase());
          } else {
            console.warn('User data not found in Realtime DB');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserInitial();
  }, [currentUser]);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for reports or locations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4 ml-4">
        <button className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
          <span className="text-white font-medium">{userInitial}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

