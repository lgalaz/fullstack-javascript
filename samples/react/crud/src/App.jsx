import { useState } from 'react';
import initialUsers from './data/users.json';
import AddUserForm from './components/AddUserForm.jsx';
import UsersTable from './components/UsersTable.jsx';

export default function App() {
  // Data is seeded from JSON; updates are in-memory for this sample.
  const [users, setUsers] = useState(initialUsers);
  const [editingIndex, setEditingIndex] = useState(null);

  function handleAddUser(name) {
    setUsers((prev) => [...prev, { name }]);
  }

  function handleStartEdit(index) {
    setEditingIndex(index);
  }

  function handleCancelEdit() {
    setEditingIndex(null);
  }

  function handleSaveEdit(index, name) {
    setUsers((prev) =>
      prev.map((user, currentIndex) =>
        currentIndex === index ? { ...user, name } : user
      )
    );
    handleCancelEdit();
  }

  function handleDeleteUser(index) {
    setUsers((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    setEditingIndex((current) => {
      if (current === null) return current;
      if (current === index) return null;
      if (index < current) return current - 1;
      return current;
    });
  }

  return (
    <div className="app">
      <header>
        <h1>Users CRUD</h1>
        <p>Simple create, read, update, delete for a local list.</p>
      </header>

      <AddUserForm onAdd={handleAddUser} />

      <UsersTable
        users={users}
        editingIndex={editingIndex}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}
