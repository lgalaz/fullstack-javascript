'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const isAuthed = status === 'authenticated';
  const userLabel = session?.user?.name ? session.user.name : 'Guest';

  async function handleLogin(event) {
    event.preventDefault();
    setAuthError('');

    const result = await signIn('credentials', {
      redirect: false,
      name,
      password,
    });

    if (result?.error) {
      setAuthError('Invalid credentials. Try luis / password.');
      return;
    }

    setName('');
    setPassword('');
  }

  function handleLogout() {
    signOut({ redirect: false });
  }

  return (
    <main className="app">
      <div className="header">
        <div>
          <h1>NextAuth Credentials Demo</h1>
          <p className="hint">
            This demo uses NextAuth with a credentials provider and a local JSON user list.
          </p>
        </div>
        <span className={`pill ${isAuthed ? 'active' : ''}`}>
          {isAuthed ? 'Authenticated' : 'Signed out'}
        </span>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="luis"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="password"
                autoComplete="current-password"
              />
            </div>
            {authError && <p className="error">{authError}</p>}
            <button type="submit" disabled={!name || !password}>
              Sign in
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Session</h2>
          <p><strong>User:</strong> {userLabel}</p>
          <p className="hint">Session status: {status}</p>
          {isAuthed ? (
            <>
              <div className="token">{JSON.stringify(session, null, 2)}</div>
              <button className="danger" type="button" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <p className="hint">Sign in to see the session payload.</p>
          )}
        </div>

        <div className="card">
          <h2>How This Maps to Real Apps</h2>
          <ul className="hint">
            <li>NextAuth verifies credentials in an API route.</li>
            <li>A JWT is issued and stored in a secure cookie.</li>
            <li>Use the session data to gate protected UI or API calls.</li>
          </ul>
          <button className="ghost" type="button" disabled={!isAuthed}>
            Protected action (demo)
          </button>
        </div>
      </div>
    </main>
  );
}
