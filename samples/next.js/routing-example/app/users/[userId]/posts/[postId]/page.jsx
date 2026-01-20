import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, getCommentsByPost } from '../../../../../data/store';

export default function PostPage({ params }) {
  const post = getPost(params.postId);
  if (!post || post.userId !== params.userId) notFound();

  const comments = getCommentsByPost(post.id);

  return (
    <section className="card">
      <h2>{post.title}</h2>
      <p>
        This page includes an intercepting route for comments via the
        <span className="code">@modal</span> slot.
      </p>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <Link href={`/users/${params.userId}/posts/${post.id}/comments/${comment.id}`}>
              {comment.author}: {comment.body}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
