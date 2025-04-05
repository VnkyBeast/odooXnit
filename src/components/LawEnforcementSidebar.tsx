import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { auth, realtimeDb } from '../firebase/config';
import { ref, onValue } from 'firebase/database';

const LawEnforcementSidebar: React.FC = () => {
    const { logout } = useAuth();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user || !user.email) return;

        // Fetch user's full name from 'users' node
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
    }, []);

    const user = auth.currentUser;
    const userEmail = user?.email ?? '';
    const userInitial = userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase();

    return (
        <div className="w-64 bg-gray-900 h-screen flex flex-col border-r border-gray-800">
            {/* App Logo */}
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
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 w-full"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default LawEnforcementSidebar;
