import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle, Mail, Phone, Shield, Calendar } from 'lucide-react';

interface UserProfile {
    name: string;
    email: string;
    phone?: string;
    role?: string;
    createdAt?: number;
}

const UserProfileDashboard: React.FC = () => {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.uid) return;

        const userRef = ref(realtimeDb, `users/${currentUser.uid}`);
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setUserData(snapshot.val());
                }
            })
            .finally(() => setLoading(false));
    }, [currentUser?.uid]);

    if (loading) return <div className="text-center text-white mt-10">Loading profile...</div>;
    if (!userData) return <div className="text-center text-white mt-10">User profile not found.</div>;

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
            <div className="bg-gray-800 border border-purple-500/30 rounded-xl p-8 w-full max-w-md shadow-2xl">
                <div className="flex flex-col items-center">
                    <UserCircle size={80} className="text-purple-400 mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">{userData.name}</h2>
                    <p className="text-purple-300 text-sm mb-6">{userData.role || 'Citizen'}</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                        <Mail size={20} className="text-purple-400" />
                        <span>{userData.email}</span>
                    </div>

                    {userData.phone && (
                        <div className="flex items-center gap-3 text-gray-300">
                            <Phone size={20} className="text-purple-400" />
                            <span>{userData.phone}</span>
                        </div>
                    )}

                    {userData.role && (
                        <div className="flex items-center gap-3 text-gray-300">
                            <Shield size={20} className="text-purple-400" />
                            <span>{userData.role}</span>
                        </div>
                    )}

                    {userData.createdAt && (
                        <div className="flex items-center gap-3 text-gray-300">
                            <Calendar size={20} className="text-purple-400" />
                            <span>
                                Joined on {new Date(userData.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileDashboard;
