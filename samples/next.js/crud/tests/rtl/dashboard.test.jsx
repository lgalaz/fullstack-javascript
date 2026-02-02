import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../app/page';

describe('dashboard page', () => {
  it('renders seed metrics', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: 'Operations Dashboard CRUD Lab' })).toBeInTheDocument();
    expect(screen.getByTestId('metrics')).toBeInTheDocument();
    expect(screen.getByTestId('companies-panel')).toBeInTheDocument();
  });

  it('validates company name when too short', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const companiesPanel = screen.getByTestId('companies-panel');
    const nameInput = companiesPanel.querySelector('input[placeholder="Company name"]');
    const domainInput = companiesPanel.querySelector('input[placeholder="company.example"]');
    const capInput = companiesPanel.querySelector('input[type="number"]');

    await user.clear(nameInput);
    await user.type(nameInput, 'AB');
    await user.clear(domainInput);
    await user.type(domainInput, 'ab.example');
    await user.clear(capInput);
    await user.type(capInput, '10');

    await user.click(within(companiesPanel).getByRole('button', { name: /create company/i }));

    expect(
      await screen.findByText('Company name must be at least 3 characters.')
    ).toBeInTheDocument();
  });

  it('creates a valid company', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const companiesPanel = screen.getByTestId('companies-panel');
    const nameInput = companiesPanel.querySelector('input[placeholder="Company name"]');
    const domainInput = companiesPanel.querySelector('input[placeholder="company.example"]');
    const capInput = companiesPanel.querySelector('input[type="number"]');

    await user.clear(nameInput);
    await user.type(nameInput, 'Sunset Robotics');
    await user.clear(domainInput);
    await user.type(domainInput, 'sunset.example');
    await user.clear(capInput);
    await user.type(capInput, '40');

    await user.click(within(companiesPanel).getByRole('button', { name: /create company/i }));

    expect(await within(companiesPanel).findByText('Sunset Robotics')).toBeInTheDocument();
    expect(screen.getByTestId('notice')).toHaveTextContent('Company created.');
  });
});
