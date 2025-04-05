import { useState } from 'react';

interface Props {
    report: {
        id: string;
        type: string;
        timestamp: number;
        description: string;
        location: string;
        imageUrl?: string;
    };
    navigate: (path: string) => void;
}

const ReportCard: React.FC<Props> = ({ report, navigate }) => {
    const [showFull, setShowFull] = useState(false);
    const keywords = report.description.split(' ').slice(0, 5).join(' ') + '...';

    return (
        <div className="bg-gray-800 rounded-xl p-4 border border-purple-500/20 shadow hover:shadow-purple-600/10 transition">
            <p className="text-purple-400 font-bold mb-1">{report.type}</p>
            <p className="text-xs text-gray-400">
                {new Date(report.timestamp).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-gray-300">
                {showFull ? report.description : keywords}
            </p>
            <button
                className="text-purple-400 text-xs mt-1 hover:underline"
                onClick={() => setShowFull(!showFull)}
            >
                {showFull ? 'Show Less' : 'Show More'}
            </button>
            <p className="text-sm mt-2 text-purple-300">📍 {report.location}</p>
            {report.imageUrl && (
                <img
                    src={report.imageUrl}
                    alt="Crime Scene"
                    className="mt-2 max-h-32 rounded border border-purple-300 object-cover"
                />
            )}
            <button
                onClick={() => navigate(`report/${report.id}`)}
                className="mt-3 w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white text-sm"
            >
                View & Analyze
            </button>
        </div>
    );
};

export default ReportCard;

