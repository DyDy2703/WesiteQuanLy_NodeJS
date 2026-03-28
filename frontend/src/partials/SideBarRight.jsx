import React, { Component } from 'react';
import './SidebarRight.css';

class SidebarRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false, // Quản lý trạng thái đóng/mở của vùng nội dung
    };
  }

  // Hàm xử lý đóng/mở sidebar
  toggleSidebar = () => {
    this.setState((prevState) => ({ isCollapsed: !prevState.isCollapsed }));
  };

  render() {
    const { issue } = this.props;
    const { isCollapsed } = this.state;

    return (
      <aside className={`sidebar-right-container ${isCollapsed ? 'collapsed' : ''}`}>
        
        {/* THANH ĐIỀU HƯỚNG ICON (Cố định ở mép trái của Sidebar) */}
        <div className="side-navigation">
          {/* Nút đặc biệt để toggle đóng mở nhanh */}
          <div className="nav-item toggle-control" onClick={this.toggleSidebar}>
            {isCollapsed ? '«' : '»'}
          </div>
          
          <div className="nav-item active" title="Details">ⓘ</div>
          <div className="nav-item" title="Charts">📊</div>
          <div className="nav-item" title="Comments">
            💬 <span className="badge-count">0</span>
          </div>
          <div className="nav-item" title="Links">🔗</div>
          <div className="nav-item" title="Checklist">
            📋 <span className="badge-count">0</span>
          </div>
          <div className="nav-item" title="Attachments">📎</div>
        </div>

        {/* VÙNG NỘI DUNG CHI TIẾT (Biến mất khi collapsed) */}
        <div className="details-content-wrapper">
          {issue ? (
            <div className="issue-main-view">
              {/* Header chi tiết */}
              <div className="issue-header">
                <div className="issue-breadcrumb">
                  <span className="proj-icon">🔵</span> 
                  {issue.projectKey} / {issue.key}
                </div>
                <div className="header-actions">
                  <button className="icon-btn">•••</button>
                  <button className="icon-btn close-btn" onClick={this.toggleSidebar}>✕</button>
                </div>
              </div>

              {/* Nội dung cuộn được */}
              <div className="issue-scroll-area">
                <h1 className="issue-title-text">{issue.summary}</h1>

                <div className="issue-fields">
                  <div className="field-group">
                    <span className="field-label">Estimate:</span>
                    <span className="field-value grayit">{issue.estimate || 'Unestimated'}</span>
                  </div>
                  <div className="field-group">
                    <span className="field-label">Remaining:</span>
                    <span className="field-value grayit">{issue.remaining || 'Unestimated'}</span>
                  </div>
                </div>

                <div className="collapsible-info">
                  <div className="info-title">⌄ Dates</div>
                  <div className="info-body">
                    <div className="field-group">
                      <span className="field-label">Due:</span>
                      <span className="field-value">None</span>
                    </div>
                    <div className="field-group">
                      <span className="field-label">Created:</span>
                      <span className="field-value">{issue.createdDate}</span>
                    </div>
                  </div>
                </div>

                <div className="collapsible-info">
                  <div className="info-title">⌄ Description</div>
                  <div className="description-content">
                    <p><strong>1. Mô tả lỗi (Description)</strong></p>
                    <div className="desc-text-render">{issue.description}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Khi không có issue, thanh điều hướng vẫn hiện, nội dung hiện chữ chờ */
            <div className="empty-selection-placeholder">
              <p>Select an issue to view details</p>
            </div>
          )}
        </div>
      </aside>
    );
  }
}

export default SidebarRight;