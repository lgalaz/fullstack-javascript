import Link from 'next/link';
import { getUsers } from '../../data/store';

export default function UsersPage() {
  const users = getUsers();

  return (
    <section className="card">
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
      <p>
        See the whitelist demo at{' '}
        <Link href="/whitelist-users/1">/whitelist-users/1</Link>.
      </p>
    </section>
  );
}
