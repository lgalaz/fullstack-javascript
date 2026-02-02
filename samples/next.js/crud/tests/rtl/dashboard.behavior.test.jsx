import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../app/page';

function getRowByText(container, text) {
  const cell = within(container).getByText(text);
  const row = cell.closest('tr');
  if (!row) throw new Error(`Row not found for text: ${text}`);
  return row;
}

describe('dashboard behavior branches', () => {
  it('supports company edit and cancel edit', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const companiesPanel = screen.getByTestId('companies-panel');
    const row = getRowByText(companiesPanel, 'Northwind Labs');
    await user.click(within(row).getByRole('button', { name: 'Edit' }));

    expect(within(companiesPanel).getByRole('button', { name: 'Update company' })).toBeInTheDocument();
    await user.click(within(companiesPanel).getByRole('button', { name: 'Cancel edit' }));
    expect(within(companiesPanel).getByRole('button', { name: 'Create company' })).toBeInTheDocument();
  });

  it('shows relation error when deleting company with dependencies', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const companiesPanel = screen.getByTestId('companies-panel');
    const row = getRowByText(companiesPanel, 'Northwind Labs');
    await user.click(within(row).getByRole('button', { name: 'Delete' }));

    expect(screen.getByTestId('notice')).toHaveTextContent(
      'Cannot delete company while users still belong to it.'
    );
  });

  it('creates and deletes a standalone company', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const companiesPanel = screen.getByTestId('companies-panel');
    await user.type(within(companiesPanel).getByPlaceholderText('Company name'), 'Solo Labs');
    await user.type(within(companiesPanel).getByPlaceholderText('company.example'), 'sololabs.example');
    await user.clear(within(companiesPanel).getByRole('spinbutton'));
    await user.type(within(companiesPanel).getByRole('spinbutton'), '15');
    await user.click(within(companiesPanel).getByRole('button', { name: 'Create company' }));

    const soloRow = getRowByText(companiesPanel, 'Solo Labs');
    await user.click(within(soloRow).getByRole('button', { name: 'Delete' }));

    expect(within(companiesPanel).queryByText('Solo Labs')).not.toBeInTheDocument();
    expect(screen.getByTestId('notice')).toHaveTextContent('Company deleted.');
  });

  it('supports user edit/cancel and create/delete flows', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const usersPanel = screen.getByTestId('users-panel');
    const existingRow = getRowByText(usersPanel, 'Mina Park');
    await user.click(within(existingRow).getByRole('button', { name: 'Edit' }));
    expect(within(usersPanel).getByRole('button', { name: 'Update user' })).toBeInTheDocument();
    await user.click(within(usersPanel).getByRole('button', { name: 'Cancel edit' }));
    expect(within(usersPanel).getByRole('button', { name: 'Create user' })).toBeInTheDocument();

    const textboxes = within(usersPanel).getAllByRole('textbox');
    await user.type(textboxes[0], 'Taylor Brooks');
    await user.type(textboxes[1], 'taylor@northwind.example');
    const selects = within(usersPanel).getAllByRole('combobox');
    await user.selectOptions(selects[0], 'manager');
    await user.clear(within(usersPanel).getByRole('spinbutton'));
    await user.type(within(usersPanel).getByRole('spinbutton'), '31');
    await user.selectOptions(selects[1], 'comp_1');
    await user.click(within(usersPanel).getByRole('button', { name: 'Create user' }));

    const createdRow = getRowByText(usersPanel, 'Taylor Brooks');
    await user.click(within(createdRow).getByRole('button', { name: 'Delete' }));
    expect(within(usersPanel).queryByText('Taylor Brooks')).not.toBeInTheDocument();
  });

  it('validates project end date before start date', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const projectsPanel = screen.getByTestId('projects-panel');
    const selects = within(projectsPanel).getAllByRole('combobox');

    await user.type(within(projectsPanel).getByRole('textbox'), 'Invalid Date Project');
    await user.selectOptions(selects[0], 'comp_1');
    await user.selectOptions(selects[1], 'usr_1');
    await user.selectOptions(selects[2], 'planned');
    await user.clear(within(projectsPanel).getByRole('spinbutton'));
    await user.type(within(projectsPanel).getByRole('spinbutton'), '20000');
    const dateInputs = projectsPanel.querySelectorAll('input[type="date"]');
    await user.type(dateInputs[0], '2026-03-20');
    await user.type(dateInputs[1], '2026-03-01');

    await user.click(within(projectsPanel).getByRole('button', { name: 'Create project' }));
    expect(screen.getByText('End date must be on or after start date.')).toBeInTheDocument();
  });

  it('supports project edit/cancel and create/delete flows', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const projectsPanel = screen.getByTestId('projects-panel');
    const existingRow = getRowByText(projectsPanel, 'Customer Portal Revamp');
    await user.click(within(existingRow).getByRole('button', { name: 'Edit' }));
    expect(within(projectsPanel).getByRole('button', { name: 'Update project' })).toBeInTheDocument();
    await user.click(within(projectsPanel).getByRole('button', { name: 'Cancel edit' }));
    expect(within(projectsPanel).getByRole('button', { name: 'Create project' })).toBeInTheDocument();

    await user.type(within(projectsPanel).getByRole('textbox'), 'Coverage Project');
    const selects = within(projectsPanel).getAllByRole('combobox');
    await user.selectOptions(selects[0], 'comp_1');
    await user.selectOptions(selects[1], 'usr_1');
    await user.selectOptions(selects[2], 'active');
    await user.clear(within(projectsPanel).getByRole('spinbutton'));
    await user.type(within(projectsPanel).getByRole('spinbutton'), '25000');
    const dateInputs = projectsPanel.querySelectorAll('input[type="date"]');
    await user.type(dateInputs[0], '2026-02-10');
    await user.type(dateInputs[1], '2026-03-10');
    await user.click(within(projectsPanel).getByRole('button', { name: 'Create project' }));

    const createdRow = getRowByText(projectsPanel, 'Coverage Project');
    await user.click(within(createdRow).getByRole('button', { name: 'Delete' }));
    expect(within(projectsPanel).queryByText('Coverage Project')).not.toBeInTheDocument();
  });

  it('creates, edits and deletes a task', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const tasksPanel = screen.getByTestId('tasks-panel');
    const textInput = tasksPanel.querySelector('input:not([type])');
    const selects = within(tasksPanel).getAllByRole('combobox');
    const spin = within(tasksPanel).getByRole('spinbutton');
    const dueDate = tasksPanel.querySelector('input[type="date"]');

    await user.type(textInput, 'RTL task flow');
    await user.selectOptions(selects[0], 'prj_1');
    await user.selectOptions(selects[1], 'usr_2');
    await user.selectOptions(selects[2], 'medium');
    await user.selectOptions(selects[3], 'todo');
    await user.clear(spin);
    await user.type(spin, '5');
    await user.type(dueDate, '2026-03-10');
    await user.click(within(tasksPanel).getByRole('button', { name: 'Create task' }));

    const taskRow = getRowByText(tasksPanel, 'RTL task flow');
    await user.click(within(taskRow).getByRole('button', { name: 'Edit' }));

    await user.clear(textInput);
    await user.type(textInput, 'RTL task flow updated');
    await user.selectOptions(selects[3], 'done');
    await user.click(within(tasksPanel).getByRole('button', { name: 'Update task' }));
    expect(within(tasksPanel).getByText('RTL task flow updated')).toBeInTheDocument();

    const updatedRow = getRowByText(tasksPanel, 'RTL task flow updated');
    await user.click(within(updatedRow).getByRole('button', { name: 'Delete' }));
    expect(within(tasksPanel).queryByText('RTL task flow updated')).not.toBeInTheDocument();
  });
});
