import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { realtimeDb } from '../firebase/config';
import { ref, get } from 'firebase/database';
import UserProfileDashboard from './UserProfileDashboard';

const SearchBar: React.FC = () => {
  const { currentUser } = useAuth();
  const [userInitial, setUserInitial] = useState('A');
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const fetchInitial = async () => {
      if (!currentUser?.uid) return;
      const snapshot = await get(ref(realtimeDb, `users/${currentUser.uid}`));
      const fullName = snapshot.val()?.fullName || currentUser.email || 'A';
      setUserInitial(fullName.charAt(0).toUpperCase());
    };
    fetchInitial();
  }, [currentUser]);

  return (
    <div className="flex justify-end items-center pr-6 relative">
      <div
        className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {userInitial}
      </div>
      {hovered && (
        <div
          className="absolute top-12 right-0 bg-gray-800 p-4 border border-purple-500 rounded-lg z-50 shadow-lg"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <UserProfileDashboard />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
