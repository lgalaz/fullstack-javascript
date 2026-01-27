import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AddUserForm from '../../src/components/AddUserForm.jsx';

describe('AddUserForm', () => {
  it('calls onAdd with trimmed input', async () => {
    const onAdd = vi.fn();
    render(<AddUserForm onAdd={onAdd} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), '  Grace Hopper  ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalledWith('Grace Hopper');
  });

  it('shows a validation error for empty input', async () => {
    render(<AddUserForm onAdd={() => {}} />);
    const user = userEvent.setup();

    const input = screen.getByLabelText(/name/i);
    await user.type(input, ' ');
    await user.clear(input);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });
});
