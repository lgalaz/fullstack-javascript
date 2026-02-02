import { describe, expect, it } from 'vitest';
import {
  deleteCompany,
  deleteProject,
  deleteTask,
  deleteUser,
  parseSeedData,
  saveCompany,
  saveProject,
  saveTask,
  saveUser,
} from '../../lib/dashboard-store';
import { seed } from '../fixtures/seed';

describe('dashboard-store branch coverage', () => {
  it('handles company create/update and duplicate constraints', () => {
    const state = parseSeedData(seed);

    const created = saveCompany(state, {
      name: 'Orbit Forge',
      domain: 'orbitforge.example',
      employeeCap: 80,
    });
    expect(created.ok).toBe(true);

    const duplicateName = saveCompany(created.state, {
      name: 'Orbit Forge',
      domain: 'orbitforge2.example',
      employeeCap: 80,
    });
    expect(duplicateName.ok).toBe(false);

    const duplicateDomain = saveCompany(created.state, {
      name: 'Orbit Forge 2',
      domain: 'orbitforge.example',
      employeeCap: 80,
    });
    expect(duplicateDomain.ok).toBe(false);

    const companyId = created.state.companies.find((company) => company.name === 'Orbit Forge').id;
    const updated = saveCompany(
      created.state,
      {
        name: 'Orbit Forge Labs',
        domain: 'orbitforge.example',
        employeeCap: 95,
      },
      companyId
    );

    expect(updated.ok).toBe(true);
    expect(updated.state.companies.find((company) => company.id === companyId).name).toBe(
      'Orbit Forge Labs'
    );
  });

  it('covers user save and delete rules', () => {
    const state = parseSeedData(seed);

    const missingCompany = saveUser(state, {
      name: 'Ghost User',
      email: 'ghost@example.com',
      role: 'contributor',
      age: 24,
      companyId: 'missing_company',
    });
    expect(missingCompany.ok).toBe(false);

    const duplicateEmail = saveUser(state, {
      name: 'Dup User',
      email: 'mina@northwind.example',
      role: 'contributor',
      age: 30,
      companyId: 'comp_1',
    });
    expect(duplicateEmail.ok).toBe(false);

    const deletableState = {
      ...state,
      tasks: state.tasks.filter((task) => task.assigneeUserId !== 'usr_2'),
    };
    const updateUser = saveUser(
      deletableState,
      {
        name: 'Mina Park Updated',
        email: 'mina.updated@northwind.example',
        role: 'manager',
        age: 30,
        companyId: 'comp_1',
      },
      'usr_2'
    );
    expect(updateUser.ok).toBe(true);

    const blockedOwnerDelete = deleteUser(state, 'usr_1');
    expect(blockedOwnerDelete.ok).toBe(false);

    const blockedTaskDelete = deleteUser(state, 'usr_2');
    expect(blockedTaskDelete.ok).toBe(false);

    const allowedDelete = deleteUser(deletableState, 'usr_2');
    expect(allowedDelete.ok).toBe(true);
  });

  it('covers project save and delete rules', () => {
    const state = parseSeedData(seed);

    const missingCompany = saveProject(state, {
      name: 'Broken Project',
      companyId: 'missing_company',
      ownerUserId: 'usr_1',
      status: 'planned',
      budget: 12000,
      startDate: '2026-02-01',
      endDate: '2026-04-01',
    });
    expect(missingCompany.ok).toBe(false);

    const missingOwner = saveProject(state, {
      name: 'Broken Project',
      companyId: 'comp_1',
      ownerUserId: 'missing_owner',
      status: 'planned',
      budget: 12000,
      startDate: '2026-02-01',
      endDate: '2026-04-01',
    });
    expect(missingOwner.ok).toBe(false);

    const crossCompanyOwner = saveProject(state, {
      name: 'Broken Project',
      companyId: 'comp_1',
      ownerUserId: 'usr_3',
      status: 'planned',
      budget: 12000,
      startDate: '2026-02-01',
      endDate: '2026-04-01',
    });
    expect(crossCompanyOwner.ok).toBe(false);

    const created = saveProject(state, {
      name: 'Support Automation',
      companyId: 'comp_1',
      ownerUserId: 'usr_1',
      status: 'active',
      budget: 45000,
      startDate: '2026-02-01',
      endDate: '2026-04-01',
    });
    expect(created.ok).toBe(true);

    const projectId = created.state.projects.find((project) => project.name === 'Support Automation').id;
    const updated = saveProject(
      created.state,
      {
        name: 'Support Automation v2',
        companyId: 'comp_1',
        ownerUserId: 'usr_1',
        status: 'blocked',
        budget: 50000,
        startDate: '2026-02-01',
        endDate: '2026-04-20',
      },
      projectId
    );
    expect(updated.ok).toBe(true);

    const blockedDelete = deleteProject(state, 'prj_1');
    expect(blockedDelete.ok).toBe(false);

    const allowedDelete = deleteProject(
      { ...state, tasks: state.tasks.filter((task) => task.projectId !== 'prj_2') },
      'prj_2'
    );
    expect(allowedDelete.ok).toBe(true);
  });

  it('covers task save and delete rules', () => {
    const state = parseSeedData(seed);

    const missingProject = saveTask(state, {
      title: 'Broken Task',
      projectId: 'missing_project',
      assigneeUserId: 'usr_2',
      priority: 'high',
      status: 'todo',
      estimateHours: 6,
      dueDate: '2026-03-01',
    });
    expect(missingProject.ok).toBe(false);

    const missingAssignee = saveTask(state, {
      title: 'Broken Task',
      projectId: 'prj_1',
      assigneeUserId: 'missing_user',
      priority: 'high',
      status: 'todo',
      estimateHours: 6,
      dueDate: '2026-03-01',
    });
    expect(missingAssignee.ok).toBe(false);

    const crossCompany = saveTask(state, {
      title: 'Broken Task',
      projectId: 'prj_1',
      assigneeUserId: 'usr_3',
      priority: 'high',
      status: 'todo',
      estimateHours: 6,
      dueDate: '2026-03-01',
    });
    expect(crossCompany.ok).toBe(false);

    const valid = saveTask(state, {
      title: 'Test Coverage Task',
      projectId: 'prj_1',
      assigneeUserId: 'usr_2',
      priority: 'medium',
      status: 'review',
      estimateHours: 8,
      dueDate: '2026-03-10',
    });
    expect(valid.ok).toBe(true);

    const taskId = valid.state.tasks.find((task) => task.title === 'Test Coverage Task').id;
    const updated = saveTask(
      valid.state,
      {
        title: 'Test Coverage Task Updated',
        projectId: 'prj_1',
        assigneeUserId: 'usr_2',
        priority: 'critical',
        status: 'done',
        estimateHours: 9,
        dueDate: '2026-03-11',
      },
      taskId
    );
    expect(updated.ok).toBe(true);

    const deleted = deleteTask(updated.state, taskId);
    expect(deleted.ok).toBe(true);
    expect(deleted.state.tasks.some((task) => task.id === taskId)).toBe(false);
  });

  it('allows deleting company only when it has no dependents', () => {
    const state = parseSeedData(seed);
    const cleanState = {
      ...state,
      users: state.users.filter((user) => user.companyId !== 'comp_2'),
      projects: state.projects.filter((project) => project.companyId !== 'comp_2'),
      tasks: state.tasks.filter((task) => task.projectId !== 'prj_2'),
    };

    const result = deleteCompany(cleanState, 'comp_2');
    expect(result.ok).toBe(true);
    expect(result.state.companies.some((company) => company.id === 'comp_2')).toBe(false);
  });
});
