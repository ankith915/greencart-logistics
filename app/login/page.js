'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'register') {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) {
        const err = await r.json();
        alert(err?.error || 'Register failed');
        return;
      }
      // Auto-login after register
    }

    // Login
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) router.push('/dashboard');
    else {
      const err = await res.json();
      alert(err?.error || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">{mode === 'login' ? 'Login' : 'Create account'}</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="mb-3 p-2 border w-full"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-3 p-2 border w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded mb-3">{mode === 'login' ? 'Login' : 'Register'}</button>
        <div className="text-center">
          <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-blue-600">
            {mode === 'login' ? "Create new account" : "Back to login"}
          </button>
        </div>
      </form>
    </div>
  );
}
