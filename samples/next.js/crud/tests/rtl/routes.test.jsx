import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import DocsOptionalCatchAllPage from '../../app/(management)/docs/[[...rest]]/page';
import UserDetailPage from '../../app/(management)/users/[userId]/page';

describe('management routes', () => {
  it('renders docs page without segments', () => {
    render(<DocsOptionalCatchAllPage params={{}} />);
    expect(screen.getByRole('heading', { name: 'Docs Optional Catch-All' })).toBeInTheDocument();
    expect(screen.getByText('No segments provided.')).toBeInTheDocument();
  });

  it('renders docs page with segments', () => {
    render(<DocsOptionalCatchAllPage params={{ rest: ['getting-started', 'setup'] }} />);
    expect(screen.getByText('Segments: getting-started / setup')).toBeInTheDocument();
  });

  it('renders user dynamic route param', () => {
    render(<UserDetailPage params={{ userId: '42' }} />);
    expect(screen.getByRole('heading', { name: 'User Detail' })).toBeInTheDocument();
    expect(screen.getByText('Dynamic route param: 42')).toBeInTheDocument();
  });
});
