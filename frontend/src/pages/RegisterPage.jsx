import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./LoginPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    display_name: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    const result = await register({
      username: formData.username,
      email: formData.email,
      display_name: formData.display_name,
      password: formData.password,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccessMessage("Đăng ký thành công, chuyển sang đăng nhập...");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">TODO</div>
        <h1 className="login-title">Đăng ký</h1>
        <p className="login-subtitle">Tạo tài khoản mới để sử dụng hệ thống</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="display_name">Tên hiển thị</label>
            <input
              id="display_name"
              type="text"
              name="display_name"
              placeholder="Nhập tên hiển thị"
              value={formData.display_name}
              onChange={handleChange}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="username">Tài khoản</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Nhập tài khoản"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error ? <div className="login-error">{error}</div> : null}
          {successMessage ? <div className="login-success">{successMessage}</div> : null}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="login-switch-text">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}