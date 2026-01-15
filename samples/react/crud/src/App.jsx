import { useState } from 'react';
import initialUsers from './data/users.json';

export default function App() {
  // Data is seeded from JSON; updates are in-memory for this sample.
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

  function handleAddUser(event) {
    event.preventDefault();
    addUser();
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
      // Check users, if the index matches then spread the user keys and update name with trimmed.
      // otherwise keep user
      prev.map((user, index) =>
        index === editingIndex ? { ...user, name: trimmed } : user
      )
    );
    cancelEdit();
  }

  function deleteUser(index) {
    // Remove the item at the given index; ignore the element value and keep all others.
    // Example: if index = 2, it keeps items 0, 1, 3, 4, ...
    // `_` is the element value placeholder (unused); `i` is the element index.
    setUsers((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) cancelEdit();
  }

  return (
    <div className="app">
      <header>
        <h1>Users CRUD</h1>
        <p>Simple create, read, update, delete for a local list.</p>
      </header>

      <form className="form" onSubmit={handleAddUser}>
        <label htmlFor="name">Name</label>
        <div className="row">
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a user name"
          />
          <button type="submit" disabled={!name.trim()}>
            Add
          </button>
        </div>
      </form>

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
                        onChange={(e) => setEditName(e.target.value)}
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
    </div>
  );
}
