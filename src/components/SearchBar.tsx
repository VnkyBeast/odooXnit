import { useEffect, useState } from 'react';
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
    <div className="w-full flex justify-end items-center p-4 border-b border-gray-800 bg-gray-900">
      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
        <span className="text-white font-medium">{userInitial}</span>
      </div>
    </div>
  );
};

export default SearchBar;
