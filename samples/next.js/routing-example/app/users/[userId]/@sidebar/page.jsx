import { getPostsByUser } from '../../../../data/store';

export default function UserSidebar({ params }) {
  const posts = getPostsByUser(params.userId);

  return (
    <div>
      <h3>Sidebar (parallel route)</h3>
      <p>{posts.length} posts</p>
      <p>Slot name: <span className="code">@sidebar</span></p>
    </div>
  );
}
