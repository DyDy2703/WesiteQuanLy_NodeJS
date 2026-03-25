import React from 'react'
import '../styles/issue-panel.css'

export default function IssueDetailPanel({issue, onClose}){
  if(!issue) return null

  const fmt = (d) => d ? new Date(d).toLocaleString() : '-'

  return (
    <div className="issue-detail-overlay">
      <div className="issue-detail-panel">
        <div className="issue-detail-header">
          <h3>{issue.issue_key || '-'} — {issue.summary || '-'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="issue-detail-body">
          <div className="issue-field"><strong>Project:</strong> {issue.project_id?.name || '-'}</div>
          <div className="issue-field"><strong>Assignee:</strong> {issue.assignee_id?.display_name || issue.assignee_id?.username || '-'}</div>
          <div className="issue-field"><strong>Reporter:</strong> {issue.reporter_id?.display_name || issue.reporter_id?.username || '-'}</div>
          <div className="issue-field"><strong>Status:</strong> {issue.status_id?.name || '-'}</div>
          <div className="issue-field"><strong>Priority:</strong> {issue.priority_id?.name || '-'}</div>

          <div className="issue-field"><strong>Start:</strong> {fmt(issue.start_at)}</div>
          <div className="issue-field"><strong>Due:</strong> {fmt(issue.due_at)}</div>
          <div className="issue-field"><strong>Estimated (h):</strong> {issue.estimated_hours ?? 0}</div>
          <div className="issue-field"><strong>Spent (h):</strong> {issue.spent_hours ?? 0}</div>
          <div className="issue-field"><strong>Completed:</strong> {fmt(issue.completed_at)}</div>

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
