import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App.jsx';

describe('App CRUD flows', () => {
  it('adds a user from the add form', async () => {
    render(<App />);
    const user = userEvent.setup();

    const input = screen.getByLabelText(/name/i);
    await user.type(input, 'Ada Lovelace');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
  });

  it('edits a user inline', async () => {
    render(<App />);
    const user = userEvent.setup();

    const luisRow = screen.getByText('Luis').closest('tr');
    await user.click(within(luisRow).getByRole('button', { name: /edit/i }));

    const editInput = screen.getByDisplayValue('Luis');
    await user.clear(editInput);
    await user.type(editInput, 'Luis Updated');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByText('Luis Updated')).toBeInTheDocument();
  });

  it('deletes a user', async () => {
    render(<App />);
    const user = userEvent.setup();

    const fernandoRow = screen.getByText('Fernando').closest('tr');
    await user.click(within(fernandoRow).getByRole('button', { name: /delete/i }));

    expect(screen.queryByText('Fernando')).not.toBeInTheDocument();
  });
});
