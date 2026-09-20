import { useState, useEffect } from "react";
import "../App.css";
import { resetPassword } from "../services/authService";

export default function ResetPasswordForm({ token, onSuccess }) {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // Calculate password strength
  useEffect(() => {
    const password = form.newPassword;
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [form.newPassword]);

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 2) return { label: "Yếu", color: "#dc2626" };
    if (passwordStrength <= 4) return { label: "Trung bình", color: "#d97706" };
    return { label: "Mạnh", color: "#16a34a" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const newPassword = form.newPassword;
    const confirmPassword = form.confirmPassword;

    // 1. Kiểm tra nhập đầy đủ
    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    // 2. Kiểm tra độ dài mật khẩu
    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    // 3. Kiểm tra độ mạnh mật khẩu
    if (passwordStrength < 3) {
      setError("Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.");
      return;
    }

    // 4. Kiểm tra xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);

      // Gọi Backend
      const result = await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      setSuccess(result.message || "Đặt lại mật khẩu thành công.");

      // Xóa form sau khi đặt lại thành công
      setForm({
        newPassword: "",
        confirmPassword: "",
      });

      // Notify parent component
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (err) {
      setError(err.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <div className="reset-password-logo">CV</div>

          <h1>Đặt lại mật khẩu</h1>

          <p className="subtitle">
            Nhập mật khẩu mới của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới</label>

            <input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Nhập mật khẩu mới"
              value={form.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading}
            />

            {form.newPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength / 6) * 100}%`,
                      backgroundColor: getPasswordStrengthLabel().color,
                    }}
                  />
                </div>
                <span
                  className="strength-label"
                  style={{ color: getPasswordStrengthLabel().color }}
                >
                  {getPasswordStrengthLabel().label}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Xác nhận mật khẩu mới
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
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
            {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}
