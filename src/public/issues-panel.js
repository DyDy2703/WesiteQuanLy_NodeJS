/* Tập tin này chỉ add behavior: tạo panel chi tiết ở phải,
   listen click trên issues table và load chi tiết từ API.
   Không sửa app.js hoặc các file khác. */
const API = 'http://localhost:5001/api';

(function () {
  function escapeHtml(text) {
    if (!text && text !== 0) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function createPanel() {
    if (document.getElementById('issue-panel')) return;
    const panel = document.createElement('aside');
    panel.id = 'issue-panel';
    panel.innerHTML = `
      <div class="panel-header">
        <div>
          <div class="issue-key" id="issue-key">-</div>
          <div class="issue-title" id="issue-title">Select an issue to view details</div>
        </div>
        <div>
          <button class="close-panel" id="close-issue-panel" title="Close">&times;</button>
        </div>
      </div>
      <div class="meta" id="issue-meta">
        <div><strong>Project:</strong> <span id="issue-project">-</span></div>
        <div><strong>Assignee:</strong> <span id="issue-assignee">-</span></div>
        <div><strong>Status:</strong> <span id="issue-status">-</span></div>
        <div><strong>Priority:</strong> <span id="issue-priority">-</span></div>
        <div><strong>Created:</strong> <span id="issue-created">-</span></div>
        <div><strong>Updated:</strong> <span id="issue-updated">-</span></div>
      </div>
      <div class="description" id="issue-description">-</div>
      <div class="panel-actions">
        <button class="btn btn-primary" id="panel-edit">Edit</button>
        <button class="btn btn-secondary" id="panel-delete">Delete</button>
      </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('close-issue-panel').addEventListener('click', () => {
      panel.classList.remove('visible');
    });

    document.getElementById('panel-edit').addEventListener('click', () => {
      const id = panel.getAttribute('data-issue-id');
      if (!id) return;
      if (typeof window.editIssue === 'function') {
        window.editIssue(id);
      } else {
        simulateRowEditClick(id);
      }
    });

    document.getElementById('panel-delete').addEventListener('click', async () => {
      const id = panel.getAttribute('data-issue-id');
      if (!id) return;
      if (!confirm('Delete this issue?')) return;
      if (typeof window.deleteIssue === 'function') {
        window.deleteIssue(id);
      } else {
        try {
          await fetch(`${API}/issues/${id}`, { method: 'DELETE' });
          if (typeof window.loadIssues === 'function') window.loadIssues();
          panel.classList.remove('visible');
        } catch (err) {
          console.error(err);
          alert('Failed to delete issue');
        }
      }
    });
  }

  function simulateRowEditClick(id) {
    const els = document.querySelectorAll(`[onclick*="editIssue('${id}')"], [onclick*='editIssue("${id}")']`);
    if (els.length) els[0].click();
  }

  function extractIdFromRow(row) {
    if (!row) return null;
    const editBtn = row.querySelector('[onclick*="editIssue("]');
    if (!editBtn) return null;
    const onclick = editBtn.getAttribute('onclick') || '';
    const m = onclick.match(/editIssue\(['"`]([0-9a-fA-F]{8,})['"`]\)/);
    return m ? m[1] : null;
  }

  function renderDetail(issue) {
    const panel = document.getElementById('issue-panel');
    if (!panel) return;
    panel.setAttribute('data-issue-id', issue._id || '');
    document.getElementById('issue-key').innerText = issue.issue_key || '-';
    document.getElementById('issue-title').innerText = issue.summary || '-';
    // project / assignee / status / priority
    document.getElementById('issue-project').innerText = issue.project_id?.name || '-';
    document.getElementById('issue-assignee').innerText = issue.assignee_id?.username || '-';
    document.getElementById('issue-status').innerHTML = issue.status_id?.name ? `<span class="badge badge-primary">${escapeHtml(issue.status_id.name)}</span>` : '-';
    document.getElementById('issue-priority').innerHTML = issue.priority_id?.name ? `<span class="badge badge-warning">${escapeHtml(issue.priority_id.name)}</span>` : '-';
    document.getElementById('issue-created').innerText = issue.createdAt ? new Date(issue.createdAt).toLocaleString() : (issue.created || '-');
    document.getElementById('issue-updated').innerText = issue.updatedAt ? new Date(issue.updatedAt).toLocaleString() : (issue.updated || '-');

    // description
    document.getElementById('issue-description').innerHTML = escapeHtml(issue.description || '-');

    // labels (if any)
    const labelsWrap = panel.querySelector('.labels') || document.createElement('div');
    labelsWrap.className = 'labels';
    labelsWrap.innerHTML = '';
    if (Array.isArray(issue.labels) && issue.labels.length) {
      issue.labels.forEach(l => {
        const span = document.createElement('span');
        span.className = 'label-pill';
        span.innerText = l;
        labelsWrap.appendChild(span);
      });
    }
    // attach labels area after meta
    const metaEl = document.getElementById('issue-meta');
    if (metaEl && !metaEl.querySelector('.labels')) metaEl.appendChild(labelsWrap);

    // attachments
    const attachmentsEl = panel.querySelector('.attachments') || document.createElement('div');
    attachmentsEl.className = 'attachments';
    attachmentsEl.innerHTML = '';
    if (Array.isArray(issue.attachments) && issue.attachments.length) {
      issue.attachments.forEach(a => {
        const el = document.createElement('div');
        el.className = 'attachment';
        el.innerHTML = `<div class="name">${escapeHtml(a.name || a.filename || 'attachment')}</div>`;
        attachmentsEl.appendChild(el);
      });
    }
    if (attachmentsEl.children.length) panel.appendChild(attachmentsEl);

    panel.classList.add('visible');
  }

  async function loadIssueDetail(id) {
    try {
      const res = await fetch(`${API}/issues/${id}`);
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      renderDetail(json.data || json);
    } catch (err) {
      console.error('Failed to load issue detail', err);
      alert('Failed to load issue detail');
    }
  }

  // expose a global helper so other scripts (app.js) can open detail panel
  window.openIssueDetail = function (id) {
    if (!id) return;
    loadIssueDetail(id);
  };

  function attachTableListener() {
    const tbody = document.getElementById('issues-tbody');
    if (!tbody) return;
    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn && (btn.getAttribute('onclick')?.includes('editIssue') || btn.getAttribute('onclick')?.includes('deleteIssue'))) {
        return;
      }
      const row = e.target.closest('tr');
      const id = extractIdFromRow(row);
      if (id) loadIssueDetail(id);
    });
  }

  function init() {
    createPanel();
    attachTableListener();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
