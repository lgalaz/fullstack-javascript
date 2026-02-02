const members = [
  { name: 'Avery Patel', role: 'Admin', status: 'Active' },
  { name: 'Noah Kim', role: 'Analyst', status: 'Active' },
  { name: 'Maya Rivera', role: 'Support', status: 'Invited' },
];

export default function UserManagement() {
  return (
    <section className="panel" aria-labelledby="users-title">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Remote app</p>
          <h2 id="users-title">User management</h2>
          <p>Roles, access, and lifecycle owned by the Users team.</p>
        </div>
        <span className="tag">users@3002</span>
      </header>

      <div className="list">
        {members.map((member) => (
          <div key={member.name} className="list-row">
            <div>
              <strong>{member.name}</strong>
              <span>{member.role}</span>
            </div>
            <span className={`status status--${member.status.toLowerCase()}`}>
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
