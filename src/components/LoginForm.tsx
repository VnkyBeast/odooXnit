import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, realtimeDb } from '../firebase/config';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const hashedInputPassword = await hashPassword(password);

      const userRef = ref(realtimeDb, `users/${uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        if (userData.password !== hashedInputPassword) {
          setError('🔐 Password mismatch. Please check your credentials.');
          return;
        }

        const usertype = userData.usertype;

        if (usertype === 'citizen') {
          navigate('/citizen-dashboard');
        } else if (usertype === 'law') {
          navigate('/law-enforcement-dashboard');
        } else {
          setError('Unknown user type.');
        }
      } else {
        setError('User data not found.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 text-white">
      <div>
        <label className="block text-sm text-purple-300 mb-1">Email</label>
        <input
          type="email"
          className="w-full p-2 rounded bg-gray-800 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-purple-300 mb-1">Password</label>
        <input
          type="password"
          className="w-full p-2 rounded bg-gray-800 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 transition w-full p-2 rounded text-white font-semibold disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </form>
  );
};

export default LoginForm;
