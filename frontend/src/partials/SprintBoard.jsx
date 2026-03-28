import React, { Component } from 'react';
import './SprintBoard.css';

// Component con: IssueCard
class IssueCard extends Component {
  render() {
    const { issue } = this.props;
    return (
      <div className={`issue-card ${issue.status === 'STAGING PASSED' ? 'highlight' : ''}`}>
        <div className="issue-left">
          <span className="issue-type-icon">📗</span>
          <span className="issue-id">{issue.key}</span>
          <span className="issue-summary">{issue.summary}</span>
        </div>
        <div className="issue-right">
          {issue.tag && <span className="issue-tag">{issue.tag}</span>}
          <div className="issue-assignee">
            <img src="https://via.placeholder.com/24" alt="user" />
          </div>
          <div className="issue-status-badge">{issue.status}</div>
        </div>
      </div>
    );
  }
}

// Component chính: SprintGroup
class SprintGroup extends Component {
  render() {
    const { sprint } = this.props;
    return (
      <div className="sprint-container">
        {/* Header của Sprint */}
        <div className="sprint-header">
          <div className="sprint-header-left">
            <span className="arrow-down">⌄</span>
            <span className="sprint-name">{sprint.name}</span>
            <span className="issue-count">{sprint.issues.length} issues</span>
            {sprint.isActive && <span className="active-badge">ACTIVE</span>}
          </div>
          <div className="sprint-header-right">
            <span className="sprint-time">⏱ {sprint.timeRange}</span>
            <button className="btn-more">•••</button>
          </div>
        </div>

        {/* Danh sách Issue bên trong Sprint */}
        <div className="sprint-content">
          {sprint.issues.map(issue => (
            <IssueCard key={issue.key} issue={issue} />
          ))}
        </div>
      </div>
    );
  }
}

// Component tổng để render toàn bộ board
class SprintBoard extends Component {
  render() {
    // const { data } = this.props; // Nhận mảng các sprint từ props
    return (
      <div className="main-sprint-board">
        {/* {data.map(sprint => (
          <SprintGroup key={sprint.id} sprint={sprint} />
        ))} */}
      </div>
    );
  }
}

export default SprintBoard;