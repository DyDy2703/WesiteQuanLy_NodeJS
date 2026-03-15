import React from 'react'
import '../styles/issue-panel.css'

export default function IssueDetailPanel({issue, onClose}){
  if(!issue) return null

  return (
    <div className="issue-detail-overlay">
      <div className="issue-detail-panel">
        <div className="issue-detail-header">
          <h3>{issue.issue_key} — {issue.summary}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="issue-detail-body">
          <div className="issue-field"><strong>Project:</strong> {issue.project_id?.name || issue.project_id}</div>
          <div className="issue-field"><strong>Assignee:</strong> {issue.assignee_id?.name || issue.assignee_id}</div>
          <div className="issue-field"><strong>Reporter:</strong> {issue.reporter_id?.name || issue.reporter_id}</div>
          <div className="issue-field"><strong>Status:</strong> {issue.status_id?.name || issue.status_id}</div>
          <div className="issue-field"><strong>Priority:</strong> {issue.priority_id?.name || issue.priority_id}</div>
          <div className="issue-field"><strong>Type:</strong> {issue.type_id?.name || issue.type_id}</div>
          <div className="issue-field"><strong>Created:</strong> {new Date(issue.createdAt).toLocaleString()}</div>

          <div className="issue-section">
            <h4>Description</h4>
            <div className="issue-desc">{issue.description || '—'}</div>
          </div>

          <div className="issue-section">
            <h4>Labels</h4>
            <div>{(issue.labels && issue.labels.join(', ')) || '—'}</div>
          </div>

          <div className="issue-section">
            <h4>Attachments</h4>
            <div>{(issue.attachments && issue.attachments.length) ? issue.attachments.map((a,i)=>(<div key={i}><a href={a.url} target="_blank" rel="noreferrer">{a.name || a.url}</a></div>)) : '—'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
import React from "react";
import "../styles/issue-panel.css";

export default function IssueDetailPanel({ issue, onClose }) {
  if (!issue) return null;

  return (
    <aside className="fp-issue-panel">
      <div className="fp-panel-header">
        <div>
          <div className="fp-issue-key">{issue.issue_key || "-"}</div>
          <div className="fp-issue-title">{issue.summary || "Untitled"}</div>
        </div>
        <div>
          <button className="fp-close" onClick={onClose} aria-label="Close">×</button>
        </div>
      </div>

      <div className="fp-meta">
        <div className="fp-row"><span className="fp-left">Project</span><span className="fp-right">{issue.project_id?.name || '-'}</span></div>
        <div className="fp-row"><span className="fp-left">Assignee</span><span className="fp-right">{issue.assignee_id?.username || '-'}</span></div>
        <div className="fp-row"><span className="fp-left">Reporter</span><span className="fp-right">{issue.reporter_id?.username || '-'}</span></div>
        <div className="fp-row"><span className="fp-left">Status</span><span className="fp-right">{issue.status_id?.name || '-'}</span></div>
        <div className="fp-row"><span className="fp-left">Priority</span><span className="fp-right">{issue.priority_id?.name || '-'}</span></div>
        <div className="fp-row"><span className="fp-left">Created</span><span className="fp-right">{issue.createdAt ? new Date(issue.createdAt).toLocaleString() : '-'}</span></div>
      </div>

      <div className="fp-section">
        <div className="fp-section-title">Description</div>
        <div className="fp-desc">{issue.description || '-'}</div>
      </div>

      {Array.isArray(issue.labels) && issue.labels.length > 0 && (
        <div className="fp-section">
          <div className="fp-section-title">Labels</div>
          <div className="fp-labels">
            {issue.labels.map((l, i) => (
              <span key={i} className="fp-label">{l}</span>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(issue.attachments) && issue.attachments.length > 0 && (
        <div className="fp-section">
          <div className="fp-section-title">Attachments</div>
          <div className="fp-attachments">
            {issue.attachments.map((a, i) => (
              <div key={i} className="fp-attachment">{a.name || a.filename || 'attachment'}</div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
