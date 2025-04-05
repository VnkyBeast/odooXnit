import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for password reset instructions.');
    } catch (err) {
      setError('Failed to reset password. Please check your email address.');
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
      
      {message && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
          {message}
        </div>
      )}

      <div>
        <p className="text-gray-300 mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
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

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Reset Instructions'}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;