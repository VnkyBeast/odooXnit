import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDatabase, ref, get, child } from 'firebase/database';

const ForgotPasswordForm = () => {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const db = getDatabase();
      const snapshot = await get(child(ref(db), `users/${identifier}`));

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const email = userData.email;

        if (!email) {
          setError("No email found for this user.");
        } else {
          await resetPassword(email);
          setMessage('Check your inbox for password reset instructions.');
        }
      } else {
        setError("User not found.");
      }
    } catch (err) {
      console.error(err);
      setError('Failed to reset password. Please try again.');
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
          Enter your username or ID. We'll fetch your email from our records and send you a reset link.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="identifier" className="block text-purple-200">
          Username or User ID
        </label>
        <input
          type="text"
          id="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-hidden focus:border-purple-500"
          placeholder="Enter your username or user ID"
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
