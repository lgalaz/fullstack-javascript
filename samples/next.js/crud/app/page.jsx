'use client';

import { useState } from 'react';
import Link from 'next/link';
import initialUsers from '../data/users.json';

export default function Home() {
  const [users, setUsers] = useState(initialUsers);
  const [name, setName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState('');

  function addUser() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUsers((prev) => [...prev, { name: trimmed }]);
    setName('');
  }

  function startEdit(index) {
    setEditingIndex(index);
    setEditName(users[index].name);
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditName('');
  }

  function saveEdit() {
    const trimmed = editName.trim();
    if (!trimmed) return;
    setUsers((prev) =>
      prev.map((user, index) =>
        index === editingIndex ? { ...user, name: trimmed } : user
      )
    );
    cancelEdit();
  }

  function deleteUser(index) {
    setUsers((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) cancelEdit();
  }

  return (
    <main className="app">
      <header>
        <h1>Users CRUD</h1>
        <p>Client-side create, read, update, delete for a local list.</p>
        <Link className="inline-link" href="/users/1">
          View sample user
        </Link>
        <Link className="inline-link" href="/docs/getting-started/setup">
          View docs catch-all
        </Link>
        <Link className="inline-link" href="/docs">
          View docs optional catch-all
        </Link>
      </header>

      <section className="form">
        <label htmlFor="name">Name</label>
        <div className="row">
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Add a user name"
          />
          <button type="button" onClick={addUser} disabled={!name.trim()}>
            Add
          </button>
        </div>
      </section>

      <section className="table">
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="2" className="empty">
                  No users yet. Add the first user above.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={`${user.name}-${index}`}>
                  <td>
                    {editingIndex === index ? (
                      <input
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="actions">
                    {editingIndex === index ? (
                      <>
                        <button type="button" onClick={saveEdit}>
                          Save
                        </button>
                        <button type="button" className="ghost" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => startEdit(index)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => deleteUser(index)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
