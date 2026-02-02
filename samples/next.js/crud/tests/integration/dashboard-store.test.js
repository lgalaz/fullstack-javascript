import { describe, expect, it } from 'vitest';
import {
  computeDashboardMetrics,
  deleteCompany,
  parseSeedData,
  saveTask,
  saveUser,
} from '../../lib/dashboard-store';
import { seed } from '../fixtures/seed';

describe('dashboard-store integration', () => {
  it('prevents creating user over company employee cap', () => {
    let state = parseSeedData(seed);
    state = {
      ...state,
      companies: state.companies.map((company) =>
        company.id === 'comp_1' ? { ...company, employeeCap: 2 } : company
      ),
    };

    const result = saveUser(state, {
      name: 'Extra User',
      email: 'extra@northwind.example',
      role: 'contributor',
      age: 25,
      companyId: 'comp_1',
    });

    expect(result.ok).toBe(false);
    expect(result.errors.form).toMatch(/employee cap/i);
  });

  it('prevents deleting a company with users or projects', () => {
    const state = parseSeedData(seed);
    const result = deleteCompany(state, 'comp_1');

    expect(result.ok).toBe(false);
    expect(result.errors.form).toMatch(/cannot delete company/i);
  });

  it('enforces task due date in project range', () => {
    const state = parseSeedData(seed);
    const result = saveTask(state, {
      title: 'Out of range task',
      projectId: 'prj_1',
      assigneeUserId: 'usr_2',
      priority: 'high',
      status: 'todo',
      estimateHours: 12,
      dueDate: '2026-09-01',
    });

    expect(result.ok).toBe(false);
    expect(result.errors.form).toMatch(/date range/i);
  });

  it('computes dashboard metrics from current state', () => {
    const state = parseSeedData(seed);
    const metrics = computeDashboardMetrics(state);

    expect(metrics).toEqual({
      companies: 2,
      users: 3,
      projects: 2,
      tasks: 2,
      activeProjects: 1,
      taskCompletion: 0,
    });
  });
});
