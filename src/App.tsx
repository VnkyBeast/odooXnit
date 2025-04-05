import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import CitizenDashboard from './pages/CitizenDashboard';
import LawEnforcementDashboard from './pages/LawEnforcementDashboard';
import CrimeMap from './pages/CrimeMap';
import ReportCrime from './pages/ReportCrime';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="text-white text-center">Loading...</div>;
  return currentUser ? element : <Navigate to="/" />;
};

function App() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-linear-to-br from-black via-purple-900 to-black flex items-center justify-center p-4">
              <div className="w-full max-w-6xl flex items-center justify-between gap-8">
                <div className="flex-1 text-center">
                  <div className="inline-block">
                    <MapPin size={120} className="text-purple-400 mx-auto mb-6" />
                    <h1 className="text-5xl font-bold text-white mb-4">SafetyNet</h1>
                    <p className="text-purple-200 text-xl">Real-time Crime Reporting & Response</p>
                  </div>
                </div>

                <div className="w-full max-w-md">
                  <div className="bg-gray-900/60 backdrop-blur-xs p-8 rounded-2xl shadow-2xl border border-purple-500/20">
                    <div className="flex mb-8 border-b border-purple-500/20">
                      <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 pb-3 text-lg font-medium transition-colors ${
                          activeTab === 'login'
                            ? 'text-purple-400 border-b-2 border-purple-400'
                            : 'text-gray-400 hover:text-purple-300'
                        }`}
                      >
                        Login
                      </button>
                      <button
                        onClick={() => setActiveTab('signup')}
                        className={`flex-1 pb-3 text-lg font-medium transition-colors ${
                          activeTab === 'signup'
                            ? 'text-purple-400 border-b-2 border-purple-400'
                            : 'text-gray-400 hover:text-purple-300'
                        }`}
                      >
                        Sign Up
                      </button>
                      <button
                        onClick={() => setActiveTab('forgot')}
                        className={`flex-1 pb-3 text-lg font-medium transition-colors ${
                          activeTab === 'forgot'
                            ? 'text-purple-400 border-b-2 border-purple-400'
                            : 'text-gray-400 hover:text-purple-300'
                        }`}
                      >
                        Forgot Password
                      </button>
                    </div>

                    {activeTab === 'login' && <LoginForm />}
                    {activeTab === 'signup' && <SignUpForm />}
                    {activeTab === 'forgot' && <ForgotPasswordForm />}
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <Route path="/citizen-dashboard" element={<PrivateRoute element={<CitizenDashboard />} />}>
          <Route path="crime-map" element={<CrimeMap />} />
          <Route path="report-crime" element={<ReportCrime />} />
          <Route index element={<Navigate to="crime-map" replace />} />
        </Route>

        <Route path="/law-dashboard" element={<PrivateRoute element={<LawEnforcementDashboard />} />}>
          <Route path="crime-map" element={<CrimeMap />} />
          <Route index element={<Navigate to="crime-map" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

