'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import companiesSeed from '../data/companies.json';
import usersSeed from '../data/users.json';
import projectsSeed from '../data/projects.json';
import tasksSeed from '../data/tasks.json';
import {
  computeDashboardMetrics,
  deleteCompany,
  deleteProject,
  deleteTask,
  deleteUser,
  parseSeedData,
  saveCompany,
  saveProject,
  saveTask,
  saveUser,
} from '../lib/dashboard-store';

const EMPTY_COMPANY = { name: '', domain: '', employeeCap: '1' };
const EMPTY_USER = { name: '', email: '', role: 'contributor', age: '18', companyId: '' };
const EMPTY_PROJECT = {
  name: '',
  companyId: '',
  ownerUserId: '',
  status: 'planned',
  budget: '1000',
  startDate: '',
  endDate: '',
};
const EMPTY_TASK = {
  title: '',
  projectId: '',
  assigneeUserId: '',
  priority: 'medium',
  status: 'todo',
  estimateHours: '1',
  dueDate: '',
};

function FieldError({ error }) {
  return error ? <p className="error">{error}</p> : null;
}

export default function Home() {
  const [state, setState] = useState(() =>
    parseSeedData({
      companies: companiesSeed,
      users: usersSeed,
      projects: projectsSeed,
      tasks: tasksSeed,
    })
  );

  const [notice, setNotice] = useState('Ready.');

  const [companyForm, setCompanyForm] = useState(EMPTY_COMPANY);
  const [companyErrors, setCompanyErrors] = useState({});
  const [editingCompanyId, setEditingCompanyId] = useState(null);

  const [userForm, setUserForm] = useState(EMPTY_USER);
  const [userErrors, setUserErrors] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);

  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [projectErrors, setProjectErrors] = useState({});
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [taskForm, setTaskForm] = useState(EMPTY_TASK);
  const [taskErrors, setTaskErrors] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);

  const metrics = useMemo(() => computeDashboardMetrics(state), [state]);

  const usersByCompany = useMemo(
    () => state.users.reduce((acc, user) => {
      acc[user.companyId] = [...(acc[user.companyId] ?? []), user];
      return acc;
    }, {}),
    [state.users]
  );

  function handleResult(result, setErrors, successMessage, reset) {
    if (!result.ok) {
      setErrors(result.errors);
      setNotice(result.errors.form ?? 'Please review field errors.');
      return;
    }

    setState(result.state);
    setErrors({});
    setNotice(successMessage);
    reset();
  }

  function companySubmit(event) {
    event.preventDefault();
    handleResult(
      saveCompany(state, companyForm, editingCompanyId),
      setCompanyErrors,
      editingCompanyId ? 'Company updated.' : 'Company created.',
      () => {
        setCompanyForm(EMPTY_COMPANY);
        setEditingCompanyId(null);
      }
    );
  }

  function userSubmit(event) {
    event.preventDefault();
    handleResult(
      saveUser(state, userForm, editingUserId),
      setUserErrors,
      editingUserId ? 'User updated.' : 'User created.',
      () => {
        setUserForm({ ...EMPTY_USER, companyId: state.companies[0]?.id ?? '' });
        setEditingUserId(null);
      }
    );
  }

  function projectSubmit(event) {
    event.preventDefault();
    handleResult(
      saveProject(state, projectForm, editingProjectId),
      setProjectErrors,
      editingProjectId ? 'Project updated.' : 'Project created.',
      () => {
        const firstCompanyId = state.companies[0]?.id ?? '';
        setProjectForm({
          ...EMPTY_PROJECT,
          companyId: firstCompanyId,
          ownerUserId: usersByCompany[firstCompanyId]?.[0]?.id ?? '',
        });
        setEditingProjectId(null);
      }
    );
  }

  function taskSubmit(event) {
    event.preventDefault();
    handleResult(
      saveTask(state, taskForm, editingTaskId),
      setTaskErrors,
      editingTaskId ? 'Task updated.' : 'Task created.',
      () => {
        setTaskForm(EMPTY_TASK);
        setEditingTaskId(null);
      }
    );
  }

  function startCompanyEdit(company) {
    setEditingCompanyId(company.id);
    setCompanyForm({
      name: company.name,
      domain: company.domain,
      employeeCap: String(company.employeeCap),
    });
    setCompanyErrors({});
  }

  function startUserEdit(user) {
    setEditingUserId(user.id);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      age: String(user.age),
      companyId: user.companyId,
    });
    setUserErrors({});
  }

  function startProjectEdit(project) {
    setEditingProjectId(project.id);
    setProjectForm({
      name: project.name,
      companyId: project.companyId,
      ownerUserId: project.ownerUserId,
      status: project.status,
      budget: String(project.budget),
      startDate: project.startDate,
      endDate: project.endDate,
    });
    setProjectErrors({});
  }

  function startTaskEdit(task) {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      projectId: task.projectId,
      assigneeUserId: task.assigneeUserId,
      priority: task.priority,
      status: task.status,
      estimateHours: String(task.estimateHours),
      dueDate: task.dueDate,
    });
    setTaskErrors({});
  }

  return (
    <main className="app">
      <header className="hero">
        <h1>Operations Dashboard CRUD Lab</h1>
        <p>Relational client-side CRUD with Zod validation and strict business rules.</p>
        <p className="notice" data-testid="notice">
          {notice}
        </p>
        <div className="hero-links">
          <Link className="inline-link" href="/users/1">
            User dynamic route
          </Link>
          <Link className="inline-link" href="/docs/getting-started/setup">
            Docs catch-all route
          </Link>
          <Link className="inline-link" href="/docs">
            Docs optional catch-all route
          </Link>
        </div>
      </header>

      <section className="metrics" data-testid="metrics">
        <article>
          <h3>Companies</h3>
          <p>{metrics.companies}</p>
        </article>
        <article>
          <h3>Users</h3>
          <p>{metrics.users}</p>
        </article>
        <article>
          <h3>Projects</h3>
          <p>{metrics.projects}</p>
        </article>
        <article>
          <h3>Tasks</h3>
          <p>{metrics.tasks}</p>
        </article>
        <article>
          <h3>Active Projects</h3>
          <p>{metrics.activeProjects}</p>
        </article>
        <article>
          <h3>Task Completion</h3>
          <p>{metrics.taskCompletion}%</p>
        </article>
      </section>

      <section className="panel" data-testid="companies-panel">
        <h2>Companies</h2>
        <form onSubmit={companySubmit} className="grid-form">
          <label>
            Name
            <input
              value={companyForm.name}
              onChange={(event) => setCompanyForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Company name"
            />
            <FieldError error={companyErrors.name} />
          </label>
          <label>
            Domain
            <input
              value={companyForm.domain}
              onChange={(event) => setCompanyForm((prev) => ({ ...prev, domain: event.target.value }))}
              placeholder="company.example"
            />
            <FieldError error={companyErrors.domain} />
          </label>
          <label>
            Employee Cap
            <input
              type="number"
              value={companyForm.employeeCap}
              onChange={(event) =>
                setCompanyForm((prev) => ({ ...prev, employeeCap: event.target.value }))
              }
              min="1"
            />
            <FieldError error={companyErrors.employeeCap} />
          </label>
          <div className="form-actions">
            <button type="submit">{editingCompanyId ? 'Update company' : 'Create company'}</button>
            {editingCompanyId ? (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setEditingCompanyId(null);
                  setCompanyForm(EMPTY_COMPANY);
                  setCompanyErrors({});
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
          <FieldError error={companyErrors.form} />
        </form>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Domain</th>
              <th>Cap</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.domain}</td>
                <td>{company.employeeCap}</td>
                <td className="actions">
                  <button type="button" onClick={() => startCompanyEdit(company)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      handleResult(
                        deleteCompany(state, company.id),
                        setCompanyErrors,
                        'Company deleted.',
                        () => {
                          if (editingCompanyId === company.id) {
                            setEditingCompanyId(null);
                            setCompanyForm(EMPTY_COMPANY);
                          }
                        }
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel" data-testid="users-panel">
        <h2>Users</h2>
        <form onSubmit={userSubmit} className="grid-form">
          <label>
            Name
            <input
              value={userForm.name}
              onChange={(event) => setUserForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <FieldError error={userErrors.name} />
          </label>
          <label>
            Email
            <input
              value={userForm.email}
              onChange={(event) => setUserForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <FieldError error={userErrors.email} />
          </label>
          <label>
            Role
            <select
              value={userForm.role}
              onChange={(event) => setUserForm((prev) => ({ ...prev, role: event.target.value }))}
            >
              <option value="admin">admin</option>
              <option value="manager">manager</option>
              <option value="contributor">contributor</option>
            </select>
            <FieldError error={userErrors.role} />
          </label>
          <label>
            Age
            <input
              type="number"
              min="18"
              max="75"
              value={userForm.age}
              onChange={(event) => setUserForm((prev) => ({ ...prev, age: event.target.value }))}
            />
            <FieldError error={userErrors.age} />
          </label>
          <label>
            Company
            <select
              value={userForm.companyId}
              onChange={(event) => setUserForm((prev) => ({ ...prev, companyId: event.target.value }))}
            >
              <option value="">Select company</option>
              {state.companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <FieldError error={userErrors.companyId} />
          </label>
          <div className="form-actions">
            <button type="submit">{editingUserId ? 'Update user' : 'Create user'}</button>
            {editingUserId ? (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setEditingUserId(null);
                  setUserForm(EMPTY_USER);
                  setUserErrors({});
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
          <FieldError error={userErrors.form} />
        </form>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{state.companies.find((company) => company.id === user.companyId)?.name ?? 'Unknown'}</td>
                <td className="actions">
                  <button type="button" onClick={() => startUserEdit(user)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      handleResult(
                        deleteUser(state, user.id),
                        setUserErrors,
                        'User deleted.',
                        () => {
                          if (editingUserId === user.id) {
                            setEditingUserId(null);
                            setUserForm(EMPTY_USER);
                          }
                        }
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel" data-testid="projects-panel">
        <h2>Projects</h2>
        <form onSubmit={projectSubmit} className="grid-form">
          <label>
            Name
            <input
              value={projectForm.name}
              onChange={(event) => setProjectForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <FieldError error={projectErrors.name} />
          </label>
          <label>
            Company
            <select
              value={projectForm.companyId}
              onChange={(event) => {
                const companyId = event.target.value;
                setProjectForm((prev) => ({
                  ...prev,
                  companyId,
                  ownerUserId: usersByCompany[companyId]?.[0]?.id ?? '',
                }));
              }}
            >
              <option value="">Select company</option>
              {state.companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <FieldError error={projectErrors.companyId} />
          </label>
          <label>
            Owner
            <select
              value={projectForm.ownerUserId}
              onChange={(event) =>
                setProjectForm((prev) => ({ ...prev, ownerUserId: event.target.value }))
              }
            >
              <option value="">Select owner</option>
              {(usersByCompany[projectForm.companyId] ?? []).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <FieldError error={projectErrors.ownerUserId} />
          </label>
          <label>
            Status
            <select
              value={projectForm.status}
              onChange={(event) => setProjectForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="planned">planned</option>
              <option value="active">active</option>
              <option value="blocked">blocked</option>
              <option value="done">done</option>
            </select>
            <FieldError error={projectErrors.status} />
          </label>
          <label>
            Budget
            <input
              type="number"
              min="1000"
              value={projectForm.budget}
              onChange={(event) => setProjectForm((prev) => ({ ...prev, budget: event.target.value }))}
            />
            <FieldError error={projectErrors.budget} />
          </label>
          <label>
            Start Date
            <input
              type="date"
              value={projectForm.startDate}
              onChange={(event) =>
                setProjectForm((prev) => ({ ...prev, startDate: event.target.value }))
              }
            />
            <FieldError error={projectErrors.startDate} />
          </label>
          <label>
            End Date
            <input
              type="date"
              value={projectForm.endDate}
              onChange={(event) => setProjectForm((prev) => ({ ...prev, endDate: event.target.value }))}
            />
            <FieldError error={projectErrors.endDate} />
          </label>
          <div className="form-actions">
            <button type="submit">{editingProjectId ? 'Update project' : 'Create project'}</button>
            {editingProjectId ? (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setEditingProjectId(null);
                  setProjectForm(EMPTY_PROJECT);
                  setProjectErrors({});
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
          <FieldError error={projectErrors.form} />
        </form>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Owner</th>
              <th>Status</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{state.companies.find((company) => company.id === project.companyId)?.name}</td>
                <td>{state.users.find((user) => user.id === project.ownerUserId)?.name}</td>
                <td>{project.status}</td>
                <td className="actions">
                  <button type="button" onClick={() => startProjectEdit(project)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      handleResult(
                        deleteProject(state, project.id),
                        setProjectErrors,
                        'Project deleted.',
                        () => {
                          if (editingProjectId === project.id) {
                            setEditingProjectId(null);
                            setProjectForm(EMPTY_PROJECT);
                          }
                        }
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel" data-testid="tasks-panel">
        <h2>Tasks</h2>
        <form onSubmit={taskSubmit} className="grid-form">
          <label>
            Title
            <input
              value={taskForm.title}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <FieldError error={taskErrors.title} />
          </label>
          <label>
            Project
            <select
              value={taskForm.projectId}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, projectId: event.target.value }))}
            >
              <option value="">Select project</option>
              {state.projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <FieldError error={taskErrors.projectId} />
          </label>
          <label>
            Assignee
            <select
              value={taskForm.assigneeUserId}
              onChange={(event) =>
                setTaskForm((prev) => ({ ...prev, assigneeUserId: event.target.value }))
              }
            >
              <option value="">Select assignee</option>
              {state.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <FieldError error={taskErrors.assigneeUserId} />
          </label>
          <label>
            Priority
            <select
              value={taskForm.priority}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, priority: event.target.value }))}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="critical">critical</option>
            </select>
            <FieldError error={taskErrors.priority} />
          </label>
          <label>
            Status
            <select
              value={taskForm.status}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="todo">todo</option>
              <option value="in_progress">in_progress</option>
              <option value="review">review</option>
              <option value="done">done</option>
            </select>
            <FieldError error={taskErrors.status} />
          </label>
          <label>
            Estimate Hours
            <input
              type="number"
              min="1"
              max="200"
              value={taskForm.estimateHours}
              onChange={(event) =>
                setTaskForm((prev) => ({ ...prev, estimateHours: event.target.value }))
              }
            />
            <FieldError error={taskErrors.estimateHours} />
          </label>
          <label>
            Due Date
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, dueDate: event.target.value }))}
            />
            <FieldError error={taskErrors.dueDate} />
          </label>
          <div className="form-actions">
            <button type="submit">{editingTaskId ? 'Update task' : 'Create task'}</button>
            {editingTaskId ? (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setEditingTaskId(null);
                  setTaskForm(EMPTY_TASK);
                  setTaskErrors({});
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
          <FieldError error={taskErrors.form} />
        </form>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Status</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{state.projects.find((project) => project.id === task.projectId)?.name}</td>
                <td>{state.users.find((user) => user.id === task.assigneeUserId)?.name}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td className="actions">
                  <button type="button" onClick={() => startTaskEdit(task)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      handleResult(
                        deleteTask(state, task.id),
                        setTaskErrors,
                        'Task deleted.',
                        () => {
                          if (editingTaskId === task.id) {
                            setEditingTaskId(null);
                            setTaskForm(EMPTY_TASK);
                          }
                        }
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
