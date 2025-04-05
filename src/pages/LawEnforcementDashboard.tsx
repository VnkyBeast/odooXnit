import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { realtimeDb } from '../firebase/config';
import LawEnforcementSidebar from '../components/LawEnforcementSidebar';
import SearchBar from '../components/SearchBar';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import CrimeMap from './CrimeMap';

interface CrimeReport {
  id: string;
  location: string;
  description: string;
  timestamp: number;
  type: string;
  imageUrl?: string;
}

const LawEnforcementDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<CrimeReport[]>([]);
  const [filter, setFilter] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const insideReportView = location.pathname.includes('/law-enforcement-dashboard/report/');

  useEffect(() => {
    const reportsRef = ref(realtimeDb, 'crimes');

    const unsubscribe = onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedReports = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...value,
        })) as CrimeReport[];
        setReports(loadedReports);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const now = Date.now();

    const getTimeLimit = () => {
      switch (filter) {
        case '1h':
          return now - 60 * 60 * 1000;
        case '24h':
          return now - 24 * 60 * 60 * 1000;
        case 'week':
          return now - 7 * 24 * 60 * 60 * 1000;
        default:
          return 0;
      }
    };

    const timeLimit = getTimeLimit();

    const filtered = reports.filter((report) =>
      filter === 'all' ? true : report.timestamp >= timeLimit
    );

    setFilteredReports(filtered);
  }, [filter, reports]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {!insideReportView && (
        <>
          <LawEnforcementSidebar />
          <div className="flex-1">
            <SearchBar />
            <main className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Reported Crimes</h2>

                <div className="flex gap-4 items-center">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-gray-800 border border-purple-500 rounded px-3 py-1 text-white"
                  >
                    <option value="all">All Time</option>
                    <option value="1h">Last 1 Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="week">This Week</option>
                  </select>

                  <button
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded"
                    onClick={() => setShowMap(!showMap)}
                  >
                    {showMap ? 'Show List' : 'Show Crime Map'}
                  </button>
                </div>
              </div>

              {showMap ? (
                <CrimeMap />
              ) : (
                <div className="grid gap-4">
                  {filteredReports.length === 0 && <p>No reports found for selected filter.</p>}

                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-gray-800 rounded p-4 border border-purple-500/20"
                    >
                      <p className="text-purple-400 font-semibold">{report.type}</p>
                      <p className="text-sm text-gray-400 mb-1">
                        {new Date(report.timestamp).toLocaleString()}
                      </p>
                      <p>{report.description}</p>
                      <p className="text-sm mt-1 text-purple-300">📍 {report.location}</p>

                      {report.imageUrl && (
                        <img
                          src={report.imageUrl}
                          alt="Crime Scene"
                          className="mt-2 max-h-48 rounded border border-purple-300"
                        />
                      )}

                      <button
                        onClick={() => navigate(`report/${report.id}`)}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white text-sm"
                      >
                        View & Analyze
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </>
      )}

      {insideReportView && (
        <div className="flex-1">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default LawEnforcementDashboard;
