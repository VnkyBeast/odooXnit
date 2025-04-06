import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, realtimeDb } from '../firebase/config';

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('citizen');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(realtimeDb, `users/${user.uid}`), {
        name,
        email,
        usertype,
      });

      setSuccess('✅ Account created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setUsertype('citizen');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4 text-white">
      <div>
        <label className="block text-sm text-purple-300 mb-1">Full Name</label>
        <input
          className="w-full p-2 rounded bg-gray-800 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

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

      <div>
        <label className="block text-sm text-purple-300 mb-1">User Type</label>
        <select
          className="w-full p-2 rounded bg-gray-800 text-white border border-purple-500"
          value={usertype}
          onChange={(e) => setUsertype(e.target.value)}
        >
          <option value="citizen">Citizen</option>
          <option value="law">Law Enforcement</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 transition w-full p-2 rounded text-white font-semibold"
      >
        Sign Up
      </button>

      {success && <p className="text-green-400 text-sm text-center">{success}</p>}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </form>
  );
};

export default SignUpForm;
