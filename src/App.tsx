import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import CitizenDashboard from './pages/CitizenDashboard';
import LawEnforcementDashboard from './pages/LawEnforcementDashboard';
import CrimeMap from './pages/CrimeMap';
import ReportCrime from './pages/ReportCrime';
import MyReports from './pages/MyReports';
import ReportDetails from './pages/ReportDetails';
import UserProfileDashboard from './components/UserProfileDashboard';
import RepoBot from './components/RepoBot';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  return currentUser ? element : <Navigate to="/" />;
};

function App() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <Router>
      <Routes>
        {/* 🔐 Authentication Page */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-4">
              <div className="w-full max-w-6xl flex items-center justify-between gap-8">
                <div className="flex-1 text-center">
                  <MapPin size={120} className="text-purple-400 mx-auto mb-6" />
                  <h1 className="text-5xl font-bold text-white mb-4">SafetyNet</h1>
                  <p className="text-purple-200 text-xl">Crime Reporting & Response</p>
                </div>

                <div className="w-full max-w-md">
                  <div className="bg-gray-900/60 backdrop-blur-xs p-8 rounded-2xl shadow-2xl border border-purple-500/20">
                    <div className="flex mb-8 border-b border-purple-500/20">
                      <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 pb-3 text-lg font-medium transition-colors ${activeTab === 'login'
                          ? 'text-purple-400 border-b-2 border-purple-400'
                          : 'text-gray-400 hover:text-purple-300'
                          }`}
                      >
                        Login
                      </button>
                      <button
                        onClick={() => setActiveTab('signup')}
                        className={`flex-1 pb-3 text-lg font-medium transition-colors ${activeTab === 'signup'
                          ? 'text-purple-400 border-b-2 border-purple-400'
                          : 'text-gray-400 hover:text-purple-300'
                          }`}
                      >
                        Sign Up
                      </button>
                    </div>

                    {activeTab === 'login' && <LoginForm />}
                    {activeTab === 'signup' && <SignUpForm />}
                  </div>
                </div>
              </div>
            </div>
          }
        />

        {/* 👤 Citizen Dashboard Routes */}
        <Route
          path="/citizen-dashboard"
          element={<PrivateRoute element={<CitizenDashboard />} />}
        >
          <Route index element={<Navigate to="crime-map" replace />} />
          <Route path="crime-map" element={<CrimeMap />} />
          <Route path="report-crime" element={<ReportCrime />} />
          <Route path="my-reports" element={<MyReports />} />
        </Route>

        {/* ✅ 👤 User Profile Page */}
        <Route
          path="/profile"
          element={<PrivateRoute element={<UserProfileDashboard />} />}
        />

        {/* 🛡️ Law Enforcement Dashboard Routes */}
        <Route
          path="/law-enforcement-dashboard"
          element={<PrivateRoute element={<LawEnforcementDashboard />} />}
        >
          <Route index element={<Navigate to="crime-map" replace />} />
          <Route path="crime-map" element={<CrimeMap />} />
          <Route path="report/:id" element={<ReportDetails />} />
        </Route>

        {/* 🔁 Catch-all: Redirect to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <RepoBot />
    </Router>
  );
}

export default App;
