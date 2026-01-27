import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../validation/userSchema.js';

export default function EditableRow({ user, index, onSave, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { name: user.name },
    mode: 'onChange',
  });

  function submit(data) {
    const trimmed = data.name.trim();
    if (!trimmed) return;
    onSave(index, trimmed);
  }

  return (
    <tr>
      <td>
        <input
          {...register('name')}
          aria-label="Edit name"
          className={errors.name ? 'input-error' : ''}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? `edit-name-error-${index}` : undefined}
        />
        {errors.name ? (
          <p className="error" id={`edit-name-error-${index}`}>
            {errors.name.message}
          </p>
        ) : null}
      </td>
      <td className="actions">
        <button type="button" onClick={handleSubmit(submit)} disabled={!isValid}>
          Save
        </button>
        <button type="button" className="ghost" onClick={onCancel}>
          Cancel
        </button>
      </td>
    </tr>
  );
}
