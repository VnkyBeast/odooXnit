// src/components/LoginForm.tsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, realtimeDb } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userRef = ref(realtimeDb, `users/${uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
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
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
      <input
        className="w-full p-2 rounded border border-gray-400 bg-white text-black"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        className="w-full p-2 rounded border border-gray-400 bg-white text-black"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button className="bg-purple-600 w-full p-2 rounded text-white hover:bg-purple-700 transition">
        Login
      </button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </form>
  );
};

export default LoginForm;
