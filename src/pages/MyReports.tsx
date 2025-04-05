import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../firebase/config';
import { getAuth } from 'firebase/auth';

interface CrimeReport {
    crimeType: string;
    date: string;
    description: string;
    email: string;
    fullName: string;
    isAnonymous: boolean;
    location: string;
    phoneNumber: string;
    time: string;
    timestamp: number;
}

const MyReports: React.FC = () => {
    const [reports, setReports] = useState<CrimeReport[]>([]);
    const [loading, setLoading] = useState(true);
    const user = getAuth().currentUser;

    useEffect(() => {
        if (!user?.email) return;

        const reportsRef = ref(realtimeDb, 'crimes');

        onValue(reportsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const allReports = Object.values(data) as CrimeReport[];
                const userReports = allReports.filter(report => report.email === user.email);
                setReports(userReports.reverse());
            } else {
                setReports([]);
            }
            setLoading(false);
        });
    }, [user?.email]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Reports</h1>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : reports.length === 0 ? (
                <p className="text-gray-600">No reports found.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report, index) => (
                        <div
                            key={index}
                            className="p-5 rounded-lg bg-white border border-gray-300 shadow-md hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{report.crimeType}</h2>
                            <p className="text-sm text-gray-600"><strong>Date:</strong> {report.date} at {report.time}</p>
                            <p className="text-sm text-gray-600"><strong>Location:</strong> {report.location}</p>
                            <p className="text-sm text-gray-600"><strong>Description:</strong> {report.description}</p>
                            <p className="text-sm text-gray-600"><strong>Submitted by:</strong> {report.isAnonymous ? "Anonymous" : report.fullName}</p>
                            <p className="text-sm text-gray-600"><strong>Email:</strong> {report.email}</p>
                            <p className="text-sm text-gray-600"><strong>Phone:</strong> {report.phoneNumber}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReports;
