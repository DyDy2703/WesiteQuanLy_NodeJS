import React, { Component } from "react";
import "./HomePage.css";
import HeaderTMS from "../partials/HeaderTMS.jsx";
import SprintBoard from "../partials/SprintBoard.jsx";
import SidebarRight from "../partials/SideBarRight.jsx";
import SidebarLeft from "../partials/SideBarLeft.jsx";
import TopBarTMS from "../partials/TopBarTMS.jsx";

class HomePage extends Component {
  constructor(props) {
    super(props);
    // Khởi tạo state để quản lý dữ liệu (Thay vì dùng biến const tĩnh)
    this.state = {
      epicsData: [
        { id: 1, name: "Đồng Bộ Portal", progress: 60, issues: [{ key: 'SM-1', summary: 'Issue 1' }] },
        { id: 2, name: "Báo cáo công nợ NPP", progress: 30, issues: [] },
      ],
      isLoading: false
    };
  }

  // Phương thức lấy dữ liệu từ API (nếu cần trong tương lai)
  fetchData = () => {
    // Logic tải dữ liệu nằm ở đây
  };

  componentDidMount() {
    // Tương đương với useEffect [] - Chạy sau khi component render lần đầu
    this.fetchData();
  }

  render() {
    const { epicsData } = this.state;

    return (
      <div className="homepage-layout">
        {/* Header hệ thống - Luôn nằm trên cùng */}
        <HeaderTMS />

        {/* Vùng nội dung bên dưới Header */}
        <div className="homepage-content">
          
          {/* Thanh công cụ và tiêu đề Backlog */}
          <TopBarTMS />
          
          {/* Vùng chia cột: SidebarLeft, SprintBoard và SidebarRight */}
          <div className="main-working-area">
            {/* Truyền dữ liệu từ state vào SidebarLeft */}
            <SidebarLeft epics={epicsData} />

            <div className="board-wrapper">
              <SprintBoard />
            </div>
            
            <SidebarRight />
          </div>

        </div>
      </div>
    );
  }
}

export default HomePage;