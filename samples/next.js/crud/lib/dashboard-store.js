import {
  companyInputSchema,
  dashboardSchema,
  projectInputSchema,
  taskInputSchema,
  toFieldErrors,
  userInputSchema,
} from './schemas';
import { createId } from './id';

export function parseSeedData(seed) {
  return dashboardSchema.parse(seed);
}

function normalizeNumbers(input, keys) {
  const output = { ...input };
  for (const key of keys) {
    output[key] = Number(output[key]);
  }
  return output;
}

function upsertById(items, nextItem) {
  const index = items.findIndex((item) => item.id === nextItem.id);
  if (index === -1) return [...items, nextItem];
  return items.map((item) => (item.id === nextItem.id ? nextItem : item));
}

function hasDuplicate(items, field, value, skipId) {
  return items.some((item) => item[field] === value && item.id !== skipId);
}

function validationError(error) {
  return { ok: false, errors: toFieldErrors(error) };
}

function relationError(message) {
  return { ok: false, errors: { form: message } };
}

export function saveCompany(state, draft, companyId) {
  const parsed = companyInputSchema.safeParse(normalizeNumbers(draft, ['employeeCap']));
  if (!parsed.success) return validationError(parsed.error);

  if (hasDuplicate(state.companies, 'name', parsed.data.name, companyId)) {
    return relationError('Company name must be unique.');
  }

  if (hasDuplicate(state.companies, 'domain', parsed.data.domain, companyId)) {
    return relationError('Company domain must be unique.');
  }

  const company = { id: companyId ?? createId('comp'), ...parsed.data };
  return {
    ok: true,
    state: { ...state, companies: upsertById(state.companies, company) },
  };
}

export function saveUser(state, draft, userId) {
  const parsed = userInputSchema.safeParse(normalizeNumbers(draft, ['age']));
  if (!parsed.success) return validationError(parsed.error);

  const company = state.companies.find((item) => item.id === parsed.data.companyId);
  if (!company) return relationError('User must belong to an existing company.');

  const usersInCompany = state.users.filter((item) => item.companyId === parsed.data.companyId);
  const companyHeadcount = usersInCompany.filter((item) => item.id !== userId).length;
  if (companyHeadcount >= company.employeeCap) {
    return relationError('Cannot exceed company employee cap.');
  }

  if (hasDuplicate(state.users, 'email', parsed.data.email, userId)) {
    return relationError('User email must be globally unique.');
  }

  const user = { id: userId ?? createId('usr'), ...parsed.data };
  return {
    ok: true,
    state: { ...state, users: upsertById(state.users, user) },
  };
}

export function saveProject(state, draft, projectId) {
  const parsed = projectInputSchema.safeParse(normalizeNumbers(draft, ['budget']));
  if (!parsed.success) return validationError(parsed.error);

  const company = state.companies.find((item) => item.id === parsed.data.companyId);
  if (!company) return relationError('Project company must exist.');

  const owner = state.users.find((item) => item.id === parsed.data.ownerUserId);
  if (!owner) return relationError('Project owner must exist.');
  if (owner.companyId !== parsed.data.companyId) {
    return relationError('Project owner must belong to the same company.');
  }

  const project = { id: projectId ?? createId('prj'), ...parsed.data };
  return {
    ok: true,
    state: { ...state, projects: upsertById(state.projects, project) },
  };
}

export function saveTask(state, draft, taskId) {
  const parsed = taskInputSchema.safeParse(normalizeNumbers(draft, ['estimateHours']));
  if (!parsed.success) return validationError(parsed.error);

  const project = state.projects.find((item) => item.id === parsed.data.projectId);
  if (!project) return relationError('Task project must exist.');

  const assignee = state.users.find((item) => item.id === parsed.data.assigneeUserId);
  if (!assignee) return relationError('Task assignee must exist.');

  if (assignee.companyId !== project.companyId) {
    return relationError('Task assignee must belong to the same company as the project.');
  }

  if (parsed.data.dueDate < project.startDate || parsed.data.dueDate > project.endDate) {
    return relationError('Task due date must be inside the project date range.');
  }

  const task = { id: taskId ?? createId('tsk'), ...parsed.data };
  return {
    ok: true,
    state: { ...state, tasks: upsertById(state.tasks, task) },
  };
}

export function deleteCompany(state, companyId) {
  if (state.users.some((item) => item.companyId === companyId)) {
    return relationError('Cannot delete company while users still belong to it.');
  }
  if (state.projects.some((item) => item.companyId === companyId)) {
    return relationError('Cannot delete company while projects still belong to it.');
  }
  return {
    ok: true,
    state: {
      ...state,
      companies: state.companies.filter((item) => item.id !== companyId),
    },
  };
}

export function deleteUser(state, userId) {
  if (state.projects.some((item) => item.ownerUserId === userId)) {
    return relationError('Cannot delete user while they own projects.');
  }
  if (state.tasks.some((item) => item.assigneeUserId === userId)) {
    return relationError('Cannot delete user while tasks are assigned to them.');
  }
  return {
    ok: true,
    state: {
      ...state,
      users: state.users.filter((item) => item.id !== userId),
    },
  };
}

export function deleteProject(state, projectId) {
  if (state.tasks.some((item) => item.projectId === projectId)) {
    return relationError('Cannot delete project while tasks exist for it.');
  }
  return {
    ok: true,
    state: {
      ...state,
      projects: state.projects.filter((item) => item.id !== projectId),
    },
  };
}

export function deleteTask(state, taskId) {
  return {
    ok: true,
    state: {
      ...state,
      tasks: state.tasks.filter((item) => item.id !== taskId),
    },
  };
}

export function computeDashboardMetrics(state) {
  const doneTasks = state.tasks.filter((task) => task.status === 'done').length;
  const taskCompletion = state.tasks.length ? Math.round((doneTasks / state.tasks.length) * 100) : 0;
  const activeProjects = state.projects.filter((project) => project.status === 'active').length;

  return {
    companies: state.companies.length,
    users: state.users.length,
    projects: state.projects.length,
    tasks: state.tasks.length,
    activeProjects,
    taskCompletion,
  };
}
