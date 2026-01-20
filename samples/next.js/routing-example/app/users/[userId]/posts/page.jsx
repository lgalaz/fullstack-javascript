import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUser, getPostsByUser } from '../../../../data/store';

export default function UserPostsPage({ params }) {
  const user = getUser(params.userId);
  if (!user) notFound();

  const posts = getPostsByUser(params.userId);

  return (
    <section>
      <h2>{user.name}'s Posts</h2>
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
