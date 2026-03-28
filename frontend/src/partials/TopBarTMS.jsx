import React, { Component } from 'react';
import './TopBarTMS.css';

class TopBarTMS extends Component {
  constructor(props) {
    super(props);
    // Khởi tạo State - Đặc trưng của OOP trong React
    this.state = {
      filters: [
        // 'STORY', 'Dev Filter', 'QC filter', 'T.Nguyen', 
        // 'Todo', 'Analysis', 'Grooming', 'Ready For Dev', 'In Progress'
      ],
    };
  }

  // Phương thức render giao diện
  render() {
    const { filters } = this.state;

    return (
      <div className="top-bar-tms">
        {/* Hàng 1: TMS Board (Chữ nhỏ) */}
        <div className="row-tms-label">TMS Board</div>

        {/* Hàng 2: Backlog (Chữ lớn) */}
        <div className="row-backlog-title">Backlog</div>

        {/* Hàng 3: Container chứa Icon, Quick Filters và Buttons */}
        <div className="main-filter-container">
        <div className="top-bar-left">
          
          {/* Box chứa icon tìm kiếm */}
          <div className="search-icon-box">
            <span className="search-icon">🔍</span>
          </div>

          {/* Label QUICK FILTERS bên ngoài */}
          <label className="quick-filters-label">QUICK FILTERS:</label>

          {/* Danh sách các nút filter */}
          <div className="filter-buttons">
            {filters.map((filter) => (
              <button key={filter} className="filter-btn-item">
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="top-bar-right">
          <div className="expand-screen-btn">⛶</div>
        </div>
        </div>
      </div>
    );
  }
}

export default TopBarTMS;