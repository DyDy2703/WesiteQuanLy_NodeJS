import React, { Component } from 'react';
import './SidebarLeft.css';

class EpicCard extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false }; // Trạng thái đóng/mở danh sách issue của Epic
  }

  toggleEpic = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { epic } = this.props;
    const { isOpen } = this.state;

    return (
      <div className="epic-card-container">
        <div className="epic-card-header" onClick={this.toggleEpic}>
          <span className={`arrow-icon ${isOpen ? 'down' : 'right'}`}>›</span>
          <span className="epic-name">{epic.name}</span>
          <span className="more-icon">•••</span>
        </div>
        
        {/* Thanh tiến độ (Progress bar) giống trong ảnh 311cca.png */}
        <div className="epic-progress-bar">
          <div className="progress-fill" style={{ width: `${epic.progress}%` }}></div>
        </div>

        {/* Danh sách Issue con - Chỉ hiển thị khi isOpen = true */}
        {isOpen && (
          <div className="epic-child-issues">
            {epic.issues && epic.issues.length > 0 ? (
              epic.issues.map((issue, index) => (
                <div key={index} className="epic-child-item">
                  📗 {issue.key}: {issue.summary}
                </div>
              ))
            ) : (
              <div className="no-issue-text">No issues in this epic</div>
            )}
          </div>
        )}
      </div>
    );
  }
}

class SidebarLeft extends Component {
  render() {
    const { epics } = this.props;

    return (
      <aside className="sidebar-left-tms">
        <div className="sidebar-left-header">
          <div className="header-tabs">
            <span className="tab-vertical">VERSIONS</span>
            <span className="tab-vertical active">EPICS</span>
          </div>
        </div>

        <div className="epic-list-content">
          <div className="all-issues-btn">All issues</div>
          
          {epics.map((epic) => (
            <EpicCard key={epic.id} epic={epic} />
          ))}
        </div>
      </aside>
    );
  }
}

export default SidebarLeft;