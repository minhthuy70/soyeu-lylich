
import { useState, useEffect } from "react";
import "./App.css";
import { registerUser } from "./services/authService";
import LoginForm from "./components/LoginForm";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  // Calculate password strength
  useEffect(() => {
    const password = form.password;
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [form.password]);

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 2) return { label: "Yếu", color: "#dc2626" };
    if (passwordStrength <= 4) return { label: "Trung bình", color: "#d97706" };
    return { label: "Mạnh", color: "#16a34a" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const email = form.email.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;
    const agreeTerms = form.agreeTerms;
    const agreePrivacy = form.agreePrivacy;

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

    // 4. Kiểm tra độ mạnh mật khẩu
    if (passwordStrength < 3) {
      setError("Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.");
      return;
    }

    // 5. Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    // 6. Kiểm tra đồng ý điều khoản
    if (!agreeTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng.");
      return;
    }

    // 7. Kiểm tra đồng ý chính sách bảo mật
    if (!agreePrivacy) {
      setError("Vui lòng đồng ý với chính sách bảo mật.");
      return;
    }

    try {
      setLoading(true);

      // Gọi Backend
      const result = await registerUser({
        email,
        password,
        confirmPassword,
        agreeTerms,
        agreePrivacy,
      });

      setSuccess(result.message || "Đăng ký tài khoản thành công.");

      if (result.requiresEmailVerification) {
        setSuccess("Đăng ký thành công! Một email xác thực đã được gửi đến " + email + ". Vui lòng kiểm tra email và làm theo hướng dẫn để xác thực tài khoản.");
      }

      // Xóa form sau khi đăng ký thành công
      setForm({
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
        agreePrivacy: false,
      });
    } catch (err) {
      setError(err.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
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
                  disabled={loading}
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
                  disabled={loading}
                />

                {form.password && (
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
                  disabled={loading}
                />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={form.agreeTerms}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>
                    Tôi đồng ý với{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer">
                      Điều khoản sử dụng
                    </a>
                  </span>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreePrivacy"
                    checked={form.agreePrivacy}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>
                    Tôi đồng ý với{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer">
                      Chính sách bảo mật
                    </a>
                  </span>
                </label>
              </div>

              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="success-message" role="status">
                  {success}
                  <div className="login-link">
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      disabled={loading}
                    >
                      Đăng nhập ngay
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading}>
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>
            </form>

            <div className="switch-auth">
              <p>
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  disabled={loading}
                >
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}