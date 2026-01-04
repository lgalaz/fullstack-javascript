import users from '../data/users.json';

export default function Home() {
  return (
    <main className="app">
      <header>
        <h1>Users List</h1>
        <p>Rendered on the server using local JSON data.</p>
      </header>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="2" className="empty">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
