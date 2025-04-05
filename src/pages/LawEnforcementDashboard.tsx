import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { realtimeDb } from '../firebase/config';
import LawEnforcementSidebar from '../components/LawEnforcementSidebar';
import SearchBar from '../components/SearchBar';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import CrimeMap from './CrimeMap';
import UserProfileDashboard from '../components/UserProfileDashboard';
import { UserRound } from 'lucide-react';

interface CrimeReport {
  id: string;
  location: string;
  description: string;
  timestamp: string; // Changed to string since that's how it's stored in the database
  type: string;
  imageUrl?: string;
}

const crimeCategories = [
  { label: 'Theft', icon: '🛍️' },
  { label: 'Assault', icon: '👊' },
  { label: 'Burglary', icon: '🏠' },
  { label: 'Robbery', icon: '💰' },
  { label: 'Vandalism', icon: '🎨' },
  { label: 'Fraud', icon: '📄' },
  { label: 'Homicide', icon: '🔪' },
  { label: 'Other', icon: '❓' },
];

const LawEnforcementDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<CrimeReport[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [expandedReports, setExpandedReports] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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

        // Extract unique locations for the filter dropdown
        const locations = Array.from(new Set(loadedReports.map(report => report.location)));
        setUniqueLocations(locations);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Apply time-based filtering
    let filtered = [...reports]; // Create a copy to avoid modifying the original array

    // Time filter logic - convert string timestamp to Date objects for comparison
    if (filter !== 'all') {
      const now = new Date();
      let cutoffDate: Date;

      switch (filter) {
        case '1h':
          cutoffDate = new Date(now.getTime() - (60 * 60 * 1000)); // 1 hour ago
          break;
        case '24h':
          cutoffDate = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days ago
          break;
        default:
          cutoffDate = new Date(0); // Beginning of time
      }

      filtered = filtered.filter(report => {
        // Parse the timestamp string to a Date object
        const reportDate = new Date(report.timestamp);
        return reportDate >= cutoffDate;
      });
    }

    // Apply category filter if selected
    if (selectedCategory) {
      filtered = filtered.filter(
        (report) => report.type.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply location filter if provided
    if (locationFilter) {
      filtered = filtered.filter(
        (report) => report.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Update filtered reports
    setFilteredReports(filtered);
  }, [filter, reports, selectedCategory, locationFilter]);

  const toggleDescription = (id: string) => {
    setExpandedReports((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // Format the timestamp string for display
  const formatTimestamp = (timestampStr: string) => {
    try {
      const date = new Date(timestampStr);
      return date.toLocaleString();
    } catch (err) {
      console.error("Error formatting timestamp:", timestampStr, err);
      return timestampStr; // Return the original string if parsing fails
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {!insideReportView && (
        <>
          {/* Sidebar Backdrop */}
          <div
            className={`fixed inset-0 z-20 transition-opacity duration-300 backdrop-blur-sm ${sidebarOpen ? 'bg-black/40 opacity-100' : 'pointer-events-none opacity-0'
              }`}
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar Panel */}
          <div
            className={`fixed top-0 left-0 w-64 h-full bg-gray-800 shadow-lg z-30 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            <LawEnforcementSidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full">
            {/* Topbar */}
            <div className="flex justify-between items-center bg-gray-800 px-6 py-3 shadow z-10 relative">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-700 hover:bg-purple-800 transition"
                  title="Toggle Sidebar"
                >
                  <UserRound className="text-white" size={22} />
                </button>
                <h1 className="text-lg font-semibold text-white">Law Enforcement Dashboard</h1>
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowDropdown((prev) => !prev);
                    setShowProfile(false);
                  }}
                  className="text-sm px-3 py-1 rounded bg-purple-700 hover:bg-purple-800"
                >
                  {currentUser?.email?.split('@')[0] || 'User'} ⌄
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded shadow-md z-20">
                    <button
                      onClick={() => {
                        setShowProfile(true);
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-purple-600"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-purple-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Drop-in Panel */}
            {showProfile && (
              <div className="absolute right-6 mt-2 w-[22rem] z-20 shadow-lg rounded-lg border border-purple-500 bg-gray-800 overflow-hidden animate-fadeIn">
                <UserProfileDashboard />
              </div>
            )}

            {/* Search + Filters */}
            <SearchBar />
            <main className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Reported Crimes</h2>
                <div className="flex gap-4 items-center">
                  {/* Time filter */}
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

                  {/* Location Filter */}
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="bg-gray-800 border border-purple-500 rounded px-3 py-1 text-white"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>

                  <button
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded"
                    onClick={() => setShowMap(!showMap)}
                  >
                    {showMap ? 'Show List' : 'Show Crime Map'}
                  </button>
                </div>
              </div>

              {/* Filter Status */}
              <div className="mb-4 text-sm text-gray-400">
                <p>
                  Showing {filteredReports.length} reports
                  {filter !== 'all' && ` from the last ${filter === '1h' ? 'hour' : filter === '24h' ? '24 hours' : 'week'}`}
                  {selectedCategory && ` in category "${selectedCategory}"`}
                  {locationFilter && ` at location "${locationFilter}"`}
                </p>
              </div>

              {/* Category Filter */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6">
                {crimeCategories.map((category) => (
                  <button
                    key={category.label}
                    className={`flex items-center gap-2 py-2 px-3 text-sm border rounded transition ${selectedCategory === category.label
                      ? 'bg-purple-600 border-purple-400'
                      : 'bg-gray-800 border-gray-700 hover:bg-purple-700'
                      }`}
                    onClick={() =>
                      setSelectedCategory((prev) =>
                        prev === category.label ? null : category.label
                      )
                    }
                  >
                    <span>{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Reports or Map */}
              {showMap ? (
                <CrimeMap />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredReports.length === 0 && (
                    <p className="col-span-full text-center text-gray-400">
                      No reports found for selected filters.
                    </p>
                  )}
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-gray-800 rounded p-4 border border-purple-500/20"
                    >
                      <p className="text-purple-400 font-semibold">{report.type}</p>
                      <p className="text-sm text-gray-400 mb-1">
                        {formatTimestamp(report.timestamp)}
                      </p>
                      <p>
                        {expandedReports[report.id]
                          ? report.description
                          : report.description.slice(0, 60) + '...'}
                        {report.description.length > 60 && (
                          <span
                            onClick={() => toggleDescription(report.id)}
                            className="text-purple-400 cursor-pointer text-sm ml-2 underline"
                          >
                            {expandedReports[report.id] ? 'View Less' : 'View More'}
                          </span>
                        )}
                      </p>
                      <p className="text-sm mt-1 text-purple-300">📍 {report.location}</p>
                      {report.imageUrl && (
                        <img
                          src={report.imageUrl}
                          alt="Crime Scene"
                          className="mt-2 max-h-32 rounded border border-purple-300"
                        />
                      )}
                      <button
                        onClick={() => navigate(`/law-enforcement-dashboard/report/${report.id}`)}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white text-sm w-full"
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