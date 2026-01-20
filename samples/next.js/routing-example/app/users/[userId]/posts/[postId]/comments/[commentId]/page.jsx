import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getComment, getPost } from '../../../../../../../data/store';

export default function CommentPage({ params }) {
  const post = getPost(params.postId);
  const comment = getComment(params.commentId);
  if (!post || !comment || comment.postId !== post.id) notFound();

  return (
    <section className="card">
      <h2>Comment detail (full page)</h2>
      <p><strong>{comment.author}</strong>: {comment.body}</p>
      <Link href={`/users/${params.userId}/posts/${post.id}`}>Back to post</Link>
    </section>
  );
}
