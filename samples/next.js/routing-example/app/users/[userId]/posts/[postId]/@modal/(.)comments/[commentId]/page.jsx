import { notFound } from 'next/navigation';
import { getComment, getPost } from '../../../../../../../../data/store';
import CloseButton from './close-button';

export default function CommentModal({ params }) {
  const post = getPost(params.postId);
  const comment = getComment(params.commentId);
  if (!post || !comment || comment.postId !== post.id) notFound();

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Comment (intercepted)</h3>
        <p><strong>{comment.author}</strong>: {comment.body}</p>
        <CloseButton href={`/users/${params.userId}/posts/${post.id}`} />
        <p style={{ marginTop: 12 }}>
          <a href={`/users/${params.userId}/posts/${post.id}`}>Direct link</a>
        </p>
      </div>
    </div>
  );
}
