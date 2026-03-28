import React, { Component } from 'react';
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import './HeaderTMS.css';

class HeaderTMS extends Component {
  constructor(props) {
    super(props);
    // Khởi tạo State - Đặc trưng của OOP trong React
    this.state = {
      menuItems : ['Dashboards', 'Projects', 'Issues', 'Boards', 'Plans'],
      searchQuery: '',
      isProfileOpen: false
    };
  }

  // Phương thức xử lý sự kiện (Method)
  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  // Toggle hiển thị menu
  toggleProfileMenu = () => {
    this.setState(prevState => ({
      isProfileOpen: !prevState.isProfileOpen
    }));
  };

  // Xử lý đăng xuất
  handleLogout = () => {
    this.setState({ isProfileOpen: false });
    ProtectedRoute.logout();
  };

  // Phương thức render giao diện
  render() {
    const { menuItems, searchQuery, isProfileOpen } = this.state;

  return (
    <header className="jira-header">
      {/* Cụm bên trái */}
      <div className="header-left">
        <div className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
          </svg>
        </div>
        
        <div className="logo" style={{ fontWeight: 'bold', margin: '0 15px', cursor: 'pointer' }}>
          TMS
        </div>

        {menuItems.map((item) => (
          <button key={item} className="nav-item">
            {item} 
            <span style={{ marginLeft: '4px', fontSize: '10px' }}>▼</span>
          </button>
        ))}

        <button className="btn-create">Create</button>
      </div>

      {/* Cụm bên phải */}
      <div className="header-right">
        <div className="search-container">
          <span style={{ position: 'absolute', left: '8px', top: '6px' }}>🔍</span>
          <input type="text" className="search-input" placeholder="Search" />
        </div>

        <div className="nav-item">🔔</div>
        <div className="nav-item">❓</div>

        {/* Container Profile để định vị Dropdown */}
          <div className="profile-container">
            <div 
              className={`avatar-wrapper ${isProfileOpen ? 'active' : ''}`} 
              onClick={this.toggleProfileMenu}
            >
              <img 
                src="https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-messages/2.png" 
                alt="user" 
                className="user-avatar-img"
              />
            </div>

            {/* Menu thả xuống khi nhấn vào Avatar */}
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">TÀI KHOẢN</div>
                <button className="dropdown-item">Thông tin người dùng</button>
                <button className="dropdown-item">Đổi mật khẩu</button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={this.handleLogout}>
                  Thoát
                </button>
              </div>
            )}
          </div>
      </div>
    </header>
  );
}};

export default HeaderTMS;