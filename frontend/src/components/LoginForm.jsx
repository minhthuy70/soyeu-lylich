import { useState } from "react";
import "../App.css";
import { loginUser } from "../services/authService";

export default function LoginForm({ onSwitchToRegister, onForgotPassword, onLoginSuccess }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const email = form.email.trim();
    const password = form.password;
    const rememberMe = form.rememberMe;

    // 1. Kiểm tra nhập đầy đủ
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    // 2. Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    try {
      setLoading(true);

      // Gọi Backend
      const result = await loginUser({
        email,
        password,
        rememberMe,
      });

      setSuccess(result.message || "Đăng nhập thành công.");

      // Lưu token
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      // Xóa form sau khi đăng nhập thành công
      setForm({
        email: "",
        password: "",
        rememberMe: false,
      });

      // Notify parent component
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">CV</div>

          <h1>Đăng nhập</h1>

          <p className="subtitle">
            Chào mừng trở lại! Đăng nhập để tiếp tục
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>

            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={onForgotPassword}
              disabled={loading}
            >
              Quên mật khẩu?
            </button>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message" role="status">
              {success}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="switch-auth">
          <p>
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              disabled={loading}
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
