import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

class ProtectedRoute extends Component {
  static COOKIE_NAME = "auth_data";

  // 1. Xử lý Đăng nhập & Lưu Session
  static login(token, durationInMinutes = 60) {
    const expiresAt = new Date().getTime() + durationInMinutes * 60 * 1000;
    const authData = JSON.stringify({ token, expiresAt });
    
    // secure: true (chỉ chạy trên https), sameSite: 'strict' để chống CSRF
    Cookies.set(this.COOKIE_NAME, authData, { expires: 7, secure: true, sameSite: 'strict' });
  }

  // 2. Xử lý Đăng xuất & Xóa Session
  static logout() {
    console.log("Remove token");
    Cookies.remove(this.COOKIE_NAME);
    // if (navigate) {
    // // replace: true để người dùng không thể nhấn nút "Back" quay lại trang cũ
    //   navigate("/login", { replace: true });
    // } else {
      window.location.href = "/login";
    // }
    // Có thể thêm window.location.href = "/login" nếu muốn redirect cứng
  }

  // 3. Lấy Token hiện tại (Dùng cho các hàm gọi API)
  static getToken() {
    const authDataRaw = Cookies.get(this.COOKIE_NAME);
    if (!authDataRaw) return null;
    try {
      const { token, expiresAt } = JSON.parse(authDataRaw);
      if (new Date().getTime() > expiresAt) {
        this.logout();
        return null;
      }
      return token;
    } catch {
      return null;
    }
  }

  isAuthenticated() {
    return !!ProtectedRoute.getToken();
  }

  render() {
    const { children } = this.props;
    if (!this.isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }
}

export default ProtectedRoute;