import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const [userType, setUserType] = useState<'citizen' | 'law'>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-purple-200">I am a:</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setUserType('citizen')}
            className={`px-4 py-2 rounded-lg flex-1 transition-colors ${
              userType === 'citizen'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Citizen
          </button>
          <button
            type="button"
            onClick={() => setUserType('law')}
            className={`px-4 py-2 rounded-lg flex-1 transition-colors ${
              userType === 'law'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Law Enforcement
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-purple-200">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-hidden focus:border-purple-500"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-purple-200">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-hidden focus:border-purple-500"
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="remember"
          className="w-4 h-4 rounded-sm border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="remember" className="ml-2 text-purple-200">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;