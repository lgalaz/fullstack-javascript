import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import UsersTable from '../../src/components/UsersTable.jsx';

describe('UsersTable', () => {
  it('shows empty state when there are no users', () => {
    render(
      <UsersTable
        users={[]}
        editingIndex={null}
        onStartEdit={() => {}}
        onCancelEdit={() => {}}
        onSaveEdit={() => {}}
        onDelete={() => {}}
      />
    );

    expect(
      screen.getByText(/no users yet\. add the first user above\./i)
    ).toBeInTheDocument();
  });
});
