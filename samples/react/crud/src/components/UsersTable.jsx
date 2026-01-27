import EditableRow from './EditableRow.jsx';
import UserRow from './UserRow.jsx';

export default function UsersTable({
  users,
  editingIndex,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}) {
  return (
    <section className="table">
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th className="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="2" className="empty">
                No users yet. Add the first user above.
              </td>
            </tr>
          ) : (
            users.map((user, index) =>
              editingIndex === index ? (
                <EditableRow
                  key={`${user.name}-${index}`}
                  user={user}
                  index={index}
                  onSave={onSaveEdit}
                  onCancel={onCancelEdit}
                />
              ) : (
                <UserRow
                  key={`${user.name}-${index}`}
                  user={user}
                  index={index}
                  onStartEdit={onStartEdit}
                  onDelete={onDelete}
                />
              )
            )
          )}
        </tbody>
      </table>
    </section>
  );
}
