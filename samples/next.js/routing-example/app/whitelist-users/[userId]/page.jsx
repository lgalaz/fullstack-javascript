import { notFound } from 'next/navigation';
import { getUser, getUsers } from '../../../data/store';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getUsers().map((user) => ({ userId: user.id }));
}

export default function WhitelistUserPage({ params }) {
  const user = getUser(params.userId);
  if (!user) notFound();

  return (
    <section className="card">
      <h1>Whitelisted user</h1>
      <p>
        Only user IDs returned by <span className="code">generateStaticParams</span>{' '}
        are allowed when <span className="code">dynamicParams = false</span>.
      </p>
      <p>User: {user.name}</p>
    </section>
  );
}
