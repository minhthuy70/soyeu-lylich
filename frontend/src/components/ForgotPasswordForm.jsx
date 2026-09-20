import { useState } from "react";
import "../App.css";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordForm({ onBackToLogin }) {
  const [form, setForm] = useState({
    email: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const email = form.email.trim();

    // 1. Kiểm tra nhập email
    if (!email) {
      setError("Vui lòng nhập email.");
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
      const result = await forgotPassword({
        email,
      });

      setSuccess(result.message || "Đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.");

      // Xóa form sau khi gửi thành công
      setForm({
        email: "",
      });
    } catch (err) {
      setError(err.message || "Gửi yêu cầu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="forgot-password-logo">CV</div>

          <h1>Quên mật khẩu</h1>

          <p className="subtitle">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
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
            {loading ? "Đang gửi..." : "Gửi hướng dẫn"}
          </button>
        </form>

        <div className="back-to-login">
          <button
            type="button"
            onClick={onBackToLogin}
            disabled={loading}
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
