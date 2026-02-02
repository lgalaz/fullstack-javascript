import { getUsers } from '../../lib/bff';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';

const statusStyles = {
  Active: 'pill pill--active',
  Invited: 'pill pill--invited',
  Suspended: 'pill pill--suspended',
};

export default function UserManagement() {
  const users = getUsers();

  return (
    <section className="microfrontend" aria-labelledby="users-title">
      <SectionHeader
        eyebrow="Microfrontend"
        title="User management"
        subtitle="Handles roles, access, and lifecycle events."
        tag="Remote: users"
        id="users-title"
      />

      <div className="table">
        <div className="table__row table__row--head">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Last seen</span>
        </div>
        {users.map((user) => (
          <div key={user.name} className="table__row">
            <span className="table__cell--strong">{user.name}</span>
            <span>{user.role}</span>
            <span className={statusStyles[user.status] || 'pill'}>{user.status}</span>
            <span className="table__cell--muted">{user.lastSeen}</span>
          </div>
        ))}
      </div>

      <div className="user-actions">
        <Button>Invite user</Button>
        <Button variant="ghost">Audit roles</Button>
      </div>
    </section>
  );
}
