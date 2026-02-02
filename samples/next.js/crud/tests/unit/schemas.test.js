import { describe, expect, it } from 'vitest';
import { projectInputSchema, taskInputSchema, userInputSchema } from '../../lib/schemas';

describe('schema validation', () => {
  it('rejects underage users', () => {
    const result = userInputSchema.safeParse({
      name: 'Sam',
      email: 'sam@example.com',
      role: 'contributor',
      age: 16,
      companyId: 'comp_1',
    });

    expect(result.success).toBe(false);
  });

  it('rejects project end date before start date', () => {
    const result = projectInputSchema.safeParse({
      name: 'Platform migration',
      companyId: 'comp_1',
      ownerUserId: 'usr_1',
      status: 'planned',
      budget: 20000,
      startDate: '2026-04-10',
      endDate: '2026-04-01',
    });

    expect(result.success).toBe(false);
  });

  it('accepts a valid task payload', () => {
    const result = taskInputSchema.safeParse({
      title: 'Ship release notes',
      projectId: 'prj_1',
      assigneeUserId: 'usr_2',
      priority: 'medium',
      status: 'review',
      estimateHours: 6,
      dueDate: '2026-03-05',
    });

    expect(result.success).toBe(true);
  });
});
