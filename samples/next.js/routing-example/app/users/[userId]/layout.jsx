import Link from 'next/link';
import { getUser } from '../../../data/store';

export default function UserLayout({ children, sidebar, params }) {
  const user = getUser(params.userId);

  return (
    <div className="sidebar-layout">
      <section className="card">
        <h1>User {user ? user.name : params.userId}</h1>
        <nav>
          <Link href={`/users/${params.userId}`}>Profile</Link> |{' '}
          <Link href={`/users/${params.userId}/posts`}>Posts</Link>
        </nav>
        <div style={{ marginTop: 16 }}>{children}</div>
      </section>
      <aside className="sidebar">{sidebar}</aside>
    </div>
  );
}
