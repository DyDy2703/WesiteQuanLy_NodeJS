import React, { Component } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx"; // Import class đã tạo

// Wrapper để sử dụng useNavigate trong Class Component (React Router v6)
function withNavigation(Component) {
  return props => <Component {...props} navigate={useNavigate()} />;
}

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showPassword: false,
      error: "",
    };
  }

  // Cập nhật giá trị input vào state
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // Đảo ngược trạng thái ẩn/hiện mật khẩu
  toggleShowPassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  // Xử lý khi nhấn nút Đăng nhập
  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    
    try {
      // Giả lập gọi API (Thay thế đoạn này bằng fetch hoặc axios của bạn)
      // const response = await authService.login(email, password);
      
      if (email === "admin@gmail.com" && password === "123456") {
        const CookieToken = "eyJsY2kiOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
        
        // GỌI PHƯƠNG THỨC TỪ PROTECTED ROUTE
        // Lưu token vào Cookie trong 120 phút (2 tiếng)
        ProtectedRoute.login(CookieToken, 120);

        console.log("Đăng nhập thành công, token đã được lưu!");
        
        // Điều hướng về trang chủ hoặc Board của Green Tech Hub
        this.props.navigate("/homepage");
      } else {
        this.setState({ error: "Email hoặc mật khẩu không chính xác!" });
      }
    } catch (err) {
      this.setState({ error: err.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { showPassword, error } = this.state;

    return (
      <div className="tms-login-container">
        <div className="tms-login-box">
          <header className="tms-login-header">
            <div className="tms-logo">
              <span className="logo-icon">T</span>
              <span className="logo-text">Task Management System</span>
            </div>
            <h1>Đăng nhập</h1>
          </header>

          <form className="tms-login-form" onSubmit={this.handleSubmit}>
            {error && <p className="error-msg">{error}</p>}
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div className="form-group password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                onChange={this.handleInputChange}
                required
              />
              <span className="toggle-password" onClick={this.toggleShowPassword}>
                {showPassword ? "Ẩn" : "Hiện"}
              </span>
            </div>

            <button type="submit" className="btn-submit">Đăng nhập</button>
          </form>

          <footer className="tms-login-footer">
            <div className="footer-links">
              <Link to="/forgot-password">Quên mật khẩu?</Link>
              <span className="dot">•</span>
              <Link to="/register">Tạo tài khoản mới</Link>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

export default withNavigation(LoginPage);