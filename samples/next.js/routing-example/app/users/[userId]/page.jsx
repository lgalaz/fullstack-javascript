import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUser, getPostsByUser } from '../../../data/store';

export default function UserPage({ params }) {
  const user = getUser(params.userId);
  if (!user) notFound();

  const posts = getPostsByUser(params.userId);

  return (
    <section>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <h3>Posts</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/users/${user.id}/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
