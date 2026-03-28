import React, { Component } from "react";
import "./RegisterPage.css";
import { Link } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false, // Trạng thái ẩn/hiện cho mật khẩu
      showConfirmPassword: false, // Trạng thái ẩn/hiện cho xác nhận mật khẩu
      error: "",
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // Phương thức đảo ngược trạng thái hiển thị (Toggle)
  toggleShowPassword = (field) => {
    this.setState((prevState) => ({
      [field]: !prevState[field]
    }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.setState({ error: "Mật khẩu xác nhận không khớp!" });
      return;
    }
    console.log("Đăng ký thành công!", this.state);
  };

  render() {
    const { showPassword, showConfirmPassword } = this.state;

    return (
      <div className="tms-register-container">
        <div className="tms-register-box">
          <header className="tms-register-header">
            <div className="tms-logo">
              <span className="logo-icon">T</span>
              <span className="logo-text">Task Management System</span>
            </div>
            <h1>Đăng ký tài khoản</h1>
          </header>

          <form className="tms-register-form" onSubmit={this.handleSubmit}>
            {this.state.error && <p className="error-msg">{this.state.error}</p>}
            
            <div className="form-group">
              <input type="text" name="fullName" placeholder="Họ và tên" onChange={this.handleInputChange} required />
            </div>

            <div className="form-group">
              <input type="email" name="email" placeholder="Địa chỉ Email" onChange={this.handleInputChange} required />
            </div>

            <div className="form-group">
              <input type="display_name" name="display_name" placeholder="Tên người dùng" onChange={this.handleInputChange} required />
            </div>

            {/* Ô mật khẩu */}
            <div className="form-group password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                onChange={this.handleInputChange}
                required
              />
              <span 
                className="toggle-password" 
                onClick={() => this.toggleShowPassword("showPassword")}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </span>
            </div>

            {/* Ô nhập lại mật khẩu */}
            <div className="form-group password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                onChange={this.handleInputChange}
                required
              />
              <span 
                className="toggle-password" 
                onClick={() => this.toggleShowPassword("showConfirmPassword")}
              >
                {showConfirmPassword ? "Ẩn" : "Hiện"}
              </span>
            </div>

            <button type="submit" className="btn-submit">Đăng ký</button>
          </form>

          <footer className="tms-register-footer">
            <span>Đã có tài khoản?</span>
            <Link to="/login" className="link-login">Đăng nhập</Link>
          </footer>
        </div>
      </div>
    );
  }
}

export default Register;