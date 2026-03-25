import React from 'react'
import '../styles/issue-card.css'

export default function IssueCard({issue, onView, onEdit, onDelete}){
  const status = issue.status_id?.name || issue.status_name || ''
  const priority = issue.priority_id?.name || ''
  const assignee = issue.assignee_id?.display_name || issue.assignee_id?.username || '-'

  const due = issue.due_at ? new Date(issue.due_at) : null
  const isOverdue = due && due < new Date()

  return (
    <article className="issue-card">
      <header className="issue-card-head">
        <div>
          <div className="issue-key">{issue.issue_key}</div>
          <div className="issue-summary" title={issue.summary}>{issue.summary}</div>
        </div>
        <div className="issue-actions">
          <button className="btn small" onClick={()=>onView(issue._id)}>View</button>
        </div>
      </header>

      <div className="issue-meta">
        <span className={`badge status ${isOverdue ? 'overdue' : ''}`}>{status}</span>
        {priority && <span className="badge priority">{priority}</span>}
        <span className="meta-item">{assignee}</span>
        {due && <span className={`meta-item due ${isOverdue ? 'overdue' : ''}`}>{due.toLocaleDateString()}</span>}
      </div>

      <footer className="issue-card-footer">
        <div className="footer-left">{issue.project_id?.name || '-'}</div>
        <div className="footer-right">
          <button className="btn tiny" onClick={()=>onEdit && onEdit(issue._id)}>Edit</button>
          <button className="btn tiny danger" onClick={()=>onDelete && onDelete(issue._id)}>Delete</button>
        </div>
      </footer>
    </article>
  )
}
