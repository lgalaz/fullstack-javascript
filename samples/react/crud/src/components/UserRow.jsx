export default function UserRow({ user, index, onStartEdit, onDelete }) {
  return (
    <tr>
      <td>{user.name}</td>
      <td className="actions">
        <button type="button" onClick={() => onStartEdit(index)}>
          Edit
        </button>
        <button type="button" className="danger" onClick={() => onDelete(index)}>
          Delete
        </button>
      </td>
    </tr>
  );
}
