// src/components/SignUpForm.tsx
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(realtimeDb, `users/${user.uid}`), {
        name,
        email,
        usertype // Do not store password in Realtime Database for security reasons
      });

      alert('User created successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4 p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Sign Up</h2>
      <input
        className="w-full p-2 rounded border border-gray-400 focus:outline-none focus:ring focus:ring-purple-600"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        className="w-full p-2 rounded border border-gray-400 focus:outline-none focus:ring focus:ring-purple-600"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        className="w-full p-2 rounded border border-gray-400 focus:outline-none focus:ring focus:ring-purple-600"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <select
        className="w-full p-2 rounded border border-gray-400 focus:outline-none focus:ring focus:ring-purple-600"
        value={usertype}
        onChange={(e) => setUsertype(e.target.value)}
      >
        <option value="citizen">Citizen</option>
        <option value="law">Law Enforcement</option>
      </select>
      <button
        className="bg-purple-600 w-full p-2 rounded text-white hover:bg-purple-700 transition duration-300"
        type="submit"
      >
        Sign Up
      </button>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </form>
  );
};

export default SignUpForm;
