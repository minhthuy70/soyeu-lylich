
import { useState } from "react";
import "./App.css";

export default function App() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa thông báo khi người dùng nhập lại
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const email = form.email.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    // 1. Kiểm tra nhập đầy đủ
    if (!email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    // 2. Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    // 3. Kiểm tra độ dài mật khẩu
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    // 4. Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    // Tạm thời chưa gọi API.
    // Sau khi tạo backend, đoạn này sẽ được thay bằng API đăng ký.
    setSuccess(
      "Thông tin hợp lệ. Sẵn sàng kết nối hệ thống đăng ký."
    );
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">CV</div>

          <h1>Tạo tài khoản</h1>

          <p className="subtitle">
            Đăng ký để bắt đầu tạo sơ yếu lý lịch của bạn
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Xác nhận mật khẩu
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
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

          <button type="submit">
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}