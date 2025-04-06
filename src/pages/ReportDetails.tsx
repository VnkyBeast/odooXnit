// src/components/ReportDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '../firebase/config';
import { X } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';

interface CrimeReport {
    id: string;
    location: string;
    description: string;
    timestamp: number;
    type: string;
    imageUrl?: string;
    userId?: string;
}

interface User {
    name: string;
    email: string;
    phone: string;
}

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const ReportDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<CrimeReport | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [sentimentScores, setSentimentScores] = useState<any[]>([]);
    const [severityChartData, setSeverityChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchReportAndUser = async () => {
            if (!id) return;

            const reportRef = ref(realtimeDb, `crimes/${id}`);
            const reportSnap = await get(reportRef);

            if (reportSnap.exists()) {
                const reportData = { id, ...reportSnap.val() } as CrimeReport;
                setReport(reportData);

                if (reportData.userId) {
                    const userRef = ref(realtimeDb, `users/${reportData.userId}`);
                    const userSnap = await get(userRef);
                    if (userSnap.exists()) {
                        setUser(userSnap.val());
                    }
                }
            }

            setLoading(false);
        };

        fetchReportAndUser();
    }, [id]);

    useEffect(() => {
        if (report) {
            analyzeReport();
        }
    }, [report]);

    const analyzeReport = async () => {
        if (!report) return;

        setAnalysis('🔍 Analyzing report using AI model...');

        const HF_API_KEY = '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';
        const modelUrl = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';

        const zeroShotQuery = async (inputText: string, labels: string[], taskName: string) => {
            const response = await fetch(modelUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: inputText,
                    parameters: { candidate_labels: labels },
                }),
            });

            const result = await response.json();

            return {
                task: taskName,
                labels: result.labels,
                scores: result.scores,
                top_label: result.labels?.[0] || '',
                top_score: result.scores?.[0] || 0,
            };
        };

        try {
            const inputText = report.description;

            const [sentiment, crimeType, department, severity] = await Promise.all([
                zeroShotQuery(inputText, ['positive', 'neutral', 'negative'], 'Sentiment'),
                zeroShotQuery(
                    inputText,
                    ['theft', 'assault', 'fraud', 'drug-related', 'vandalism', 'cybercrime'],
                    'Crime Type'
                ),
                zeroShotQuery(
                    inputText,
                    [
                        'local police department',
                        'narcotics control bureau',
                        'cyber crime investigation unit',
                        'economic offenses wing',
                        'women safety cell',
                        'anti-terrorism squad',
                        'traffic control department',
                    ],
                    'Recommended Department'
                ),
                zeroShotQuery(inputText, ['low', 'medium', 'high'], 'Severity Level'),
            ]);

            setSentimentScores(
                sentiment.labels.map((label: string, i: number) => ({
                    name: label,
                    value: parseFloat((sentiment.scores[i] * 100).toFixed(2)),
                }))
            );

            setSeverityChartData([{ name: severity.top_label, value: 100 }]);

            const analysisResult = `
🧠 AI Analysis:
• Sentiment: ${sentiment.top_label} (${(sentiment.top_score * 100).toFixed(2)}%)
• Crime Type: ${crimeType.top_label}
• Department: ${department.top_label}
• Severity: ${severity.top_label}
      `;

            setAnalysis(analysisResult.trim());
        } catch (error) {
            setAnalysis('❌ Failed to analyze the report. Please try again.');
            console.error('AI analysis error:', error);
        }
    };

    if (loading) return <div className="text-white text-center mt-10">Loading report...</div>;
    if (!report) return <div className="text-white text-center mt-10">Report not found.</div>;

    return (
        <div className="flex h-screen bg-gray-900 text-white p-4">
            {/* Left Column - Report Details */}
            <div className="w-1/2 pr-4">
                <div className="relative bg-gray-800 p-6 rounded-lg border border-purple-500/30 h-full overflow-auto">
                    <button
                        onClick={() => navigate('/law-enforcement-dashboard')}
                        className="absolute top-4 right-4 text-purple-300 hover:text-purple-500 transition"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-3xl font-bold mb-4 text-purple-400">Crime Report Details</h2>

                    <p className="text-purple-300 font-semibold text-lg">{report.type}</p>
                    <p className="text-sm text-gray-400 mb-2">
                        {new Date(report.timestamp).toLocaleString()}
                    </p>
                    <p className="mb-4">{report.description}</p>
                    <p className="text-purple-400 mb-2">📍 {report.location}</p>

                    {report.imageUrl && (
                        <img
                            src={report.imageUrl}
                            alt="Reported crime scene"
                            className="mt-4 rounded border border-purple-400 max-h-64 w-full object-contain"
                        />
                    )}

                    {user && (
                        <div className="mt-6 border-t border-purple-500/30 pt-4">
                            <h3 className="text-lg font-semibold text-purple-300 mb-2">Reporter Details</h3>
                            <p>
                                <strong>Name:</strong> {user.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>
                            <p>
                                <strong>Phone:</strong> {user.phone}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column - AI Analysis */}
            <div className="w-1/2 pl-4">
                <div className="bg-gray-800 p-6 rounded-lg border border-purple-500/30 h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-purple-400">AI Analysis</h2>

                    <div className="grid grid-cols-2 gap-4 flex-grow">
                        {/* Sentiment Bar Chart */}
                        <div className="bg-gray-700/50 p-3 rounded border border-purple-500/30">
                            <h3 className="text-md font-semibold text-purple-300 mb-1">Sentiment Heatmap</h3>
                            <ResponsiveContainer width="100%" height={140}>
                                <BarChart data={sentimentScores} layout="vertical">
                                    <XAxis type="number" domain={[0, 100]} unit="%" hide />
                                    <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value: any) => `${value}%`} />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Severity Pie Chart */}
                        <div className="bg-gray-700/50 p-3 rounded border border-purple-500/30">
                            <h3 className="text-md font-semibold text-purple-300 mb-1">Severity Level</h3>
                            <ResponsiveContainer width="100%" height={140}>
                                <PieChart>
                                    <Pie
                                        data={severityChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name }) => name}
                                        outerRadius={50}
                                        dataKey="value"
                                    >
                                        {severityChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="mt-4 bg-purple-800/30 border border-purple-500/40 rounded p-4 text-sm whitespace-pre-line text-purple-200 h-1/3">
                        {analysis || "Click 'Analyze with AI' to generate insights"}
                    </div>

                    <button
                        onClick={analyzeReport}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded text-white font-semibold transition"
                    >
                        Analyze with AI
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
