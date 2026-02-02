import { z } from 'zod';

const idSchema = z.string().min(3).max(40);
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format.');

export const companySchema = z.object({
  id: idSchema,
  name: z
    .string()
    .trim()
    .min(3, 'Company name must be at least 3 characters.')
    .max(60, 'Company name must be 60 characters or less.'),
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+\.[a-z]+(?:\.[a-z]+)?$/, 'Domain must look like company.example.'),
  employeeCap: z
    .number({ invalid_type_error: 'Employee cap must be a number.' })
    .int('Employee cap must be a whole number.')
    .min(1, 'Employee cap must be at least 1.')
    .max(50000, 'Employee cap must be 50,000 or less.'),
});

export const companyInputSchema = companySchema.omit({ id: true });

export const userSchema = z.object({
  id: idSchema,
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(50),
  email: z.string().trim().toLowerCase().email('Email must be valid.').max(120),
  role: z.enum(['admin', 'manager', 'contributor']),
  age: z
    .number({ invalid_type_error: 'Age must be a number.' })
    .int('Age must be a whole number.')
    .min(18, 'Age must be 18 or older.')
    .max(75, 'Age must be 75 or younger.'),
  companyId: idSchema,
});

export const userInputSchema = userSchema.omit({ id: true });

const projectBaseSchema = z.object({
  id: idSchema,
  name: z.string().trim().min(3).max(80),
  companyId: idSchema,
  ownerUserId: idSchema,
  status: z.enum(['planned', 'active', 'blocked', 'done']),
  budget: z
    .number({ invalid_type_error: 'Budget must be a number.' })
    .min(1000, 'Budget must be at least 1,000.')
    .max(10000000, 'Budget must be at most 10,000,000.'),
  startDate: isoDateSchema,
  endDate: isoDateSchema,
});

function withProjectDateRule(schema) {
  return schema.refine((value) => value.endDate >= value.startDate, {
    message: 'End date must be on or after start date.',
    path: ['endDate'],
  });
}

export const projectSchema = withProjectDateRule(projectBaseSchema);

export const projectInputSchema = withProjectDateRule(projectBaseSchema.omit({ id: true }));

export const taskSchema = z.object({
  id: idSchema,
  title: z.string().trim().min(3).max(120),
  projectId: idSchema,
  assigneeUserId: idSchema,
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['todo', 'in_progress', 'review', 'done']),
  estimateHours: z
    .number({ invalid_type_error: 'Estimate hours must be a number.' })
    .int('Estimate hours must be a whole number.')
    .min(1)
    .max(200),
  dueDate: isoDateSchema,
});

export const taskInputSchema = taskSchema.omit({ id: true });

export const dashboardSchema = z.object({
  companies: z.array(companySchema),
  users: z.array(userSchema),
  projects: z.array(projectSchema),
  tasks: z.array(taskSchema),
});

export function toFieldErrors(zodError) {
  return zodError.issues.reduce((acc, issue) => {
    const path = issue.path[0] ?? 'form';
    acc[path] = issue.message;
    return acc;
  }, {});
}
