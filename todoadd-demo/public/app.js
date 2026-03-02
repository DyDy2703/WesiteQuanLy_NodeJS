const API = '/api';
let currentView = 'todos';
let currentEntityType = 'todos';
let editingId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadTodos();
});

function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => switchView(link.dataset.view));
  });

  // Add button
  document.getElementById('add-btn').addEventListener('click', openAddModal);

  // Modal close
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
  });

  // Form submit
  document.getElementById('entity-form').addEventListener('submit', handleFormSubmit);

  // Search
  document.querySelector('.search-input').addEventListener('keyup', handleSearch);
}

function switchView(view) {
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.view === view);
  });

  // Hide all views, show selected
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`${view}-view`)?.classList.add('active');

  // Update page title
  const titles = {
    todos: 'Todos',
    projects: 'Projects',
    issues: 'Issues',
    users: 'Users',
    sprints: 'Sprints',
    boards: 'Boards',
  };
  document.getElementById('page-title').textContent = titles[view];

  currentView = view;
  currentEntityType = view;

  // Load data
  switch (view) {
    case 'todos':
      loadTodos();
      break;
    case 'projects':
      loadProjects();
      break;
    case 'issues':
      loadIssues();
      break;
    case 'users':
      loadUsers();
      break;
    case 'sprints':
      loadSprints();
      break;
    case 'boards':
      loadBoards();
      break;
  }
}

// ========== TODOS ==========
async function loadTodos() {
  try {
    const res = await fetch(`${API}/todos`);
    const data = await res.json();
    renderTodos(data.data || []);
  } catch (err) {
    showToast('Failed to load todos', 'error');
  }
}

function renderTodos(todos) {
  const container = document.getElementById('todos-list');
  if (!todos.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><div class="empty-state-title">No todos yet</div></div>';
    return;
  }
  container.innerHTML = todos
    .map(
      (todo) => `
    <div class="todo-item ${todo.isCompleted ? 'completed' : ''}">
      <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? 'checked' : ''} 
        onchange="toggleTodo('${todo._id}', this.checked)">
      <div class="todo-content">
        <div class="todo-title">${escapeHtml(todo.title)}</div>
        ${todo.description ? `<div class="todo-desc">${escapeHtml(todo.description)}</div>` : ''}
      </div>
      <div class="todo-actions">
        <button class="btn btn-secondary btn-sm" onclick="editTodo('${todo._id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTodo('${todo._id}')">Delete</button>
      </div>
    </div>
    `
    )
    .join('');
}

async function toggleTodo(id, completed) {
  try {
    await fetch(`${API}/todos/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: completed }),
    });
    loadTodos();
    showToast('Todo updated', 'success');
  } catch (err) {
    showToast('Failed to update todo', 'error');
  }
}

async function deleteTodo(id) {
  if (!confirm('Delete this todo?')) return;
  try {
    await fetch(`${API}/todos/${id}`, { method: 'DELETE' });
    loadTodos();
    showToast('Todo deleted', 'success');
  } catch (err) {
    showToast('Failed to delete todo', 'error');
  }
}

async function editTodo(id) {
  try {
    const res = await fetch(`${API}/todos/${id}`);
    const data = await res.json();
    editingId = id;
    currentEntityType = 'todos';
    openEditModal(data.data);
  } catch (err) {
    showToast('Failed to load todo', 'error');
  }
}

// ========== PROJECTS ==========
async function loadProjects() {
  try {
    const res = await fetch(`${API}/projects`);
    const data = await res.json();
    renderProjects(data.data || []);
  } catch (err) {
    showToast('Failed to load projects', 'error');
  }
}

function renderProjects(projects) {
  const container = document.getElementById('projects-grid');
  if (!projects.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📁</div><div class="empty-state-title">No projects yet</div></div>';
    return;
  }
  container.innerHTML = projects
    .map(
      (proj) => `
    <div class="card">
      <div class="card-title">${escapeHtml(proj.name)}</div>
      <div class="card-desc">${escapeHtml(proj.description || 'No description')}</div>
      <div class="card-meta">
        <span>Key: <strong>${proj.key}</strong></span>
      </div>
      <div class="action-buttons">
        <button class="btn btn-secondary btn-sm" onclick="editProject('${proj._id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProject('${proj._id}')">Delete</button>
      </div>
    </div>
    `
    )
    .join('');
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  try {
    await fetch(`${API}/projects/${id}`, { method: 'DELETE' });
    loadProjects();
    showToast('Project deleted', 'success');
  } catch (err) {
    showToast('Failed to delete project', 'error');
  }
}

async function editProject(id) {
  try {
    const res = await fetch(`${API}/projects/${id}`);
    const data = await res.json();
    editingId = id;
    currentEntityType = 'projects';
    openEditModal(data.data);
  } catch (err) {
    showToast('Failed to load project', 'error');
  }
}

// ========== ISSUES ==========
async function loadIssues() {
  try {
    const res = await fetch(`${API}/issues`);
    const data = await res.json();
    renderIssues(data.data || []);
  } catch (err) {
    showToast('Failed to load issues', 'error');
  }
}

function renderIssues(issues) {
  const tbody = document.getElementById('issues-tbody');
  if (!issues.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No issues yet</td></tr>';
    return;
  }
  tbody.innerHTML = issues
    .map(
      (issue) => `
    <tr>
      <td><strong>${escapeHtml(issue.issue_key)}</strong></td>
      <td>${escapeHtml(issue.summary)}</td>
      <td><span class="badge badge-primary">${issue.status_id?.name || 'N/A'}</span></td>
      <td><span class="badge badge-warning">${issue.priority_id?.name || 'N/A'}</span></td>
      <td>${issue.assignee_id?.username || '-'}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-secondary btn-sm" onclick="editIssue('${issue._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteIssue('${issue._id}')">Delete</button>
        </div>
      </td>
    </tr>
    `
    )
    .join('');
}

async function deleteIssue(id) {
  if (!confirm('Delete this issue?')) return;
  try {
    await fetch(`${API}/issues/${id}`, { method: 'DELETE' });
    loadIssues();
    showToast('Issue deleted', 'success');
  } catch (err) {
    showToast('Failed to delete issue', 'error');
  }
}

async function editIssue(id) {
  try {
    const res = await fetch(`${API}/issues/${id}`);
    const data = await res.json();
    editingId = id;
    currentEntityType = 'issues';
    openEditModal(data.data);
  } catch (err) {
    showToast('Failed to load issue', 'error');
  }
}

// ========== USERS ==========
async function loadUsers() {
  try {
    const res = await fetch(`${API}/users`);
    const data = await res.json();
    renderUsers(data.data || []);
  } catch (err) {
    showToast('Failed to load users', 'error');
  }
}

function renderUsers(users) {
  const tbody = document.getElementById('users-tbody');
  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No users yet</td></tr>';
    return;
  }
  tbody.innerHTML = users
    .map(
      (user) => `
    <tr>
      <td><strong>${escapeHtml(user.username)}</strong></td>
      <td>${escapeHtml(user.email)}</td>
      <td><span class="badge badge-primary">${user.role || 'user'}</span></td>
      <td>${user.active ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-danger">Inactive</span>'}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-secondary btn-sm" onclick="editUser('${user._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
        </div>
      </td>
    </tr>
    `
    )
    .join('');
}

async function deleteUser(id) {
  if (!confirm('Delete this user?')) return;
  try {
    await fetch(`${API}/users/${id}`, { method: 'DELETE' });
    loadUsers();
    showToast('User deleted', 'success');
  } catch (err) {
    showToast('Failed to delete user', 'error');
  }
}

async function editUser(id) {
  try {
    const res = await fetch(`${API}/users/${id}`);
    const data = await res.json();
    editingId = id;
    currentEntityType = 'users';
    openEditModal(data.data);
  } catch (err) {
    showToast('Failed to load user', 'error');
  }
}

// ========== SPRINTS ==========
async function loadSprints() {
  try {
    const res = await fetch(`${API}/sprints`);
    const data = await res.json();
    renderSprints(data.data || []);
  } catch (err) {
    showToast('Failed to load sprints', 'error');
  }
}

function renderSprints(sprints) {
  const container = document.getElementById('sprints-grid');
  if (!sprints.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏃</div><div class="empty-state-title">No sprints yet</div></div>';
    return;
  }
  container.innerHTML = sprints
    .map(
      (sprint) => `
    <div class="card">
      <div class="card-title">${escapeHtml(sprint.name)}</div>
      <div class="card-meta">
        <span>Status: <strong>${sprint.status || 'planned'}</strong></span>
      </div>
      <div class="action-buttons">
        <button class="btn btn-secondary btn-sm" onclick="editSprint('${sprint._id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteSprint('${sprint._id}')">Delete</button>
      </div>
    </div>
    `
    )
    .join('');
}

async function deleteSprint(id) {
  if (!confirm('Delete this sprint?')) return;
  try {
    await fetch(`${API}/sprints/${id}`, { method: 'DELETE' });
    loadSprints();
    showToast('Sprint deleted', 'success');
  } catch (err) {
    showToast('Failed to delete sprint', 'error');
  }
}

async function editSprint(id) {
  try {
    const res = await fetch(`${API}/sprints/${id}`);
    const data = await res.json();
    editingId = id;
    currentEntityType = 'sprints';
    openEditModal(data.data);
  } catch (err) {
    showToast('Failed to load sprint', 'error');
  }
}

// ========== BOARDS ==========
async function loadBoards() {
  try {
    const res = await fetch(`${API}/boards`);
    const data = await res.json();
    renderBoards(data.data || []);
  } catch (err) {
    showToast('Failed to load boards', 'error');
  }
}

function renderBoards(boards) {
  const container = document.getElementById('boards-grid');
  if (!boards.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🎨</div><div class="empty-state-title">No boards yet</div></div>';
    return;
  }
  container.innerHTML = boards
    .map(
      (board) => `
    <div class="card">
      <div class="card-title">${escapeHtml(board.name)}</div>
      <div class="action-buttons">
        <button class="btn btn-secondary btn-sm" onclick="editBoard('${board._id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteBoard('${board._id}')">Delete</button>
      </div>
    </div>
    `
    )
    .join('');
}

async function deleteBoard(id) {
  if (!confirm('Delete this board?')) return;
  try {
    await fetch(`${API}/boards/${id}`, { method: 'DELETE' });
    loadBoards();
    showToast('Board deleted', 'success');
  } catch (err) {
    showToast('Failed to delete board', 'error');
  }
}

async function editBoard(id) {
  try {
    const res = await fetch(`${API}/boards/${id}`);
    const data = await res.json();
    editingId = id;
    currentEntityType = 'boards';
    openEditModal(data.data);
  } catch (err) {
    showToast('Failed to load board', 'error');
  }
}

// ========== MODAL FORMS ==========
function openAddModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = `Add New ${currentView.slice(0, -1).toUpperCase()}`;
  const form = document.getElementById('entity-form');
  form.innerHTML = getFormFields(currentEntityType, null) + `
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

function openEditModal(entity) {
  document.getElementById('modal-title').textContent = `Edit ${currentView.slice(0, -1).toUpperCase()}`;
  const form = document.getElementById('entity-form');
  form.innerHTML = getFormFields(currentEntityType, entity) + `
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button type="submit" class="btn btn-primary">Update</button>
    </div>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

function getFormFields(type, entity) {
  const fields = {
    todos: `
      <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" value="${entity?.title || ''}" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="description">${entity?.description || ''}</textarea>
      </div>
    `,
    projects: `
      <div class="form-group">
        <label>Name</label>
        <input type="text" name="name" value="${entity?.name || ''}" required>
      </div>
      <div class="form-group">
        <label>Key</label>
        <input type="text" name="key" value="${entity?.key || ''}" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="description">${entity?.description || ''}</textarea>
      </div>
    `,
    issues: `
      <div class="form-group">
        <label>Issue Key</label>
        <input type="text" name="issue_key" value="${entity?.issue_key || ''}" required>
      </div>
      <div class="form-group">
        <label>Summary</label>
        <input type="text" name="summary" value="${entity?.summary || ''}" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="description">${entity?.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Project ID</label>
        <input type="text" name="project_id" value="${entity?.project_id?._id || ''}" required>
      </div>
    `,
    users: `
      <div class="form-group">
        <label>Username</label>
        <input type="text" name="username" value="${entity?.username || ''}" required>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" value="${entity?.email || ''}" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" value="${entity?.password || ''}" ${!entity ? 'required' : ''}>
      </div>
      <div class="form-group">
        <label>Display Name</label>
        <input type="text" name="display_name" value="${entity?.display_name || ''}">
      </div>
      <div class="form-group">
        <label>Role</label>
        <select name="role">
          <option value="user" ${entity?.role === 'user' ? 'selected' : ''}>User</option>
          <option value="admin" ${entity?.role === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      </div>
    `,
    sprints: `
      <div class="form-group">
        <label>Name</label>
        <input type="text" name="name" value="${entity?.name || ''}" required>
      </div>
      <div class="form-group">
        <label>Status</label>
        <select name="status">
          <option value="planned" ${entity?.status === 'planned' ? 'selected' : ''}>Planned</option>
          <option value="active" ${entity?.status === 'active' ? 'selected' : ''}>Active</option>
          <option value="completed" ${entity?.status === 'completed' ? 'selected' : ''}>Completed</option>
        </select>
      </div>
    `,
    boards: `
      <div class="form-group">
        <label>Name</label>
        <input type="text" name="name" value="${entity?.name || ''}" required>
      </div>
      <div class="form-group">
        <label>Project ID</label>
        <input type="text" name="project_id" value="${entity?.project_id?._id || ''}">
      </div>
    `,
  };
  return fields[type] || '';
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  editingId = null;
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form);

  try {
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/${currentEntityType}/${editingId}` : `${API}/${currentEntityType}`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Request failed');

    closeModal();
    showToast(editingId ? 'Updated successfully' : 'Created successfully', 'success');

    // Reload data
    switch (currentEntityType) {
      case 'todos':
        loadTodos();
        break;
      case 'projects':
        loadProjects();
        break;
      case 'issues':
        loadIssues();
        break;
      case 'users':
        loadUsers();
        break;
      case 'sprints':
        loadSprints();
        break;
      case 'boards':
        loadBoards();
        break;
    }
  } catch (err) {
    showToast('Failed to save', 'error');
  }
}

function handleSearch(e) {
  // Search implementation can be added here if needed
}

// ========== UTILITIES ==========
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}
