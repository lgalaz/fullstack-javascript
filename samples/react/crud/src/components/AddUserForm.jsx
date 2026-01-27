import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../validation/userSchema.js';

export default function AddUserForm({ onAdd }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '' },
    mode: 'onChange',
  });

  function submit(data) {
    const trimmed = data.name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    reset();
  }

  return (
    <form className="form" onSubmit={handleSubmit(submit)}>
      <label htmlFor="name">Name</label>
      <div className="row">
        <input
          id="name"
          {...register('name')}
          placeholder="Add a user name"
          className={errors.name ? 'input-error' : ''}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'add-name-error' : undefined}
        />
        <button type="submit" disabled={!isValid}>
          Add
        </button>
      </div>
      {errors.name ? (
        <p className="error" id="add-name-error">
          {errors.name.message}
        </p>
      ) : null}
    </form>
  );
}
