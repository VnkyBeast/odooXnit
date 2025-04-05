import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '../firebase/config';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

interface CrimeReport {
    id: string;
    location: string;
    description: string;
    timestamp: number;
    type: string;
    imageUrl?: string;
}

const ReportDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { currentUser } = useAuth();
    const [report, setReport] = useState<CrimeReport | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const reportRef = ref(realtimeDb, `crimes/${id}`);
        get(reportRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setReport({ id, ...snapshot.val() });
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    const analyzeReport = () => {
        if (!report) return;

        // Simulate AI response using basic logic (replace with real AI logic later)
        const keywords = ['urgent', 'help', 'robbery', 'attack', 'fire', 'gun', 'knife'];
        const score = keywords.reduce((acc, word) =>
            report.description.toLowerCase().includes(word) ? acc + 1 : acc
            , 0);

        if (score >= 2) {
            setAnalysis('✅ This report appears CREDIBLE based on AI analysis.');
        } else {
            setAnalysis('⚠️ This report may be SUSPICIOUS or lacks urgency. Further review recommended.');
        }
    };

    if (loading) return <div className="text-white text-center mt-10">Loading report...</div>;
    if (!report) return <div className="text-white text-center mt-10">Report not found.</div>;

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar
                userType="law"
                userName={currentUser?.displayName ?? 'Anon'}
                reportsCount={1}
            />

            <main className="flex-1 p-6">
                <h2 className="text-3xl font-bold mb-4 text-purple-400">Crime Report Details</h2>

                <div className="bg-gray-800 p-6 rounded-lg border border-purple-500/30 max-w-3xl">
                    <p className="text-purple-300 font-semibold text-lg">{report.type}</p>
                    <p className="text-sm text-gray-400 mb-2">
                        {new Date(report.timestamp).toLocaleString()}
                    </p>
                    <p className="mb-4">{report.description}</p>
                    <p className="text-purple-400">📍 {report.location}</p>

                    {report.imageUrl && (
                        <img
                            src={report.imageUrl}
                            alt="Crime Scene"
                            className="mt-4 rounded border border-purple-400 max-h-60"
                        />
                    )}

                    <button
                        onClick={analyzeReport}
                        className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded text-white font-semibold"
                    >
                        Analyze with AI
                    </button>

                    {analysis && (
                        <div className="mt-4 bg-purple-800/30 border border-purple-500/40 rounded p-4 text-sm text-purple-200">
                            {analysis}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReportDetails;
