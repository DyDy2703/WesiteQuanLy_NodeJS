import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

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
    setLoading(true);

    const result = await login(formData.username, formData.password);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(from, { replace: true });
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">TODO</div>
        <h1 className="login-title">Đăng nhập</h1>
        <p className="login-subtitle">Đăng nhập để vào hệ thống quản lý công việc</p>

        <form className="login-form" onSubmit={handleSubmit}>
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

          {error ? <div className="login-error">{error}</div> : null}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="login-switch-text">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}