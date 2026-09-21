import { useState, useEffect } from "react";
import "../App.css";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  logoutUser,
} from "../services/authService";
import Dashboard from "./Dashboard";
import ResumeBuilder from "./ResumeBuilder";
import BasicInformation from "./BasicInformation";
import ContactInformation from "./ContactInformation";
import IdentityInformation from "./IdentityInformation";
import CareerObjective from "./CareerObjective";
import References from "./References";
import Education from "./Education";
import Certificates from "./Certificates";
import OnlineCourses from "./OnlineCourses";
import Experience from "./Experience";
import FreelanceProjects from "./FreelanceProjects";
import TechnicalSkills from "./TechnicalSkills";
import SoftSkills from "./SoftSkills";
import LanguageSkills from "./LanguageSkills";
import ToolSkills from "./ToolSkills";
import Projects from "./Projects";
import ProjectGallery from "./ProjectGallery";
import ProjectAnalytics from "./ProjectAnalytics";
import Achievements from "./Achievements";
import Activities from "./Activities";
import Volunteering from "./Volunteering";
import Publications from "./Publications";
import Patents from "./Patents";
import SessionManagement from "./SessionManagement";

export default function ProfilePage({ onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    currentAddress: "",
    personalPhoto: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);

      if (data.profile) {
        setForm({
          fullName: data.profile.fullName || "",
          dateOfBirth: data.profile.dateOfBirth
            ? new Date(data.profile.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: data.profile.gender || "",
          phoneNumber: data.profile.phoneNumber || "",
          currentAddress: data.profile.currentAddress || "",
          personalPhoto: data.profile.personalPhoto || "",
        });
      }
    } catch (err) {
      setError(err.message || "Lỗi khi tải thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile(form);
      setSuccess("Cập nhật thông tin thành công");
      setEditMode(false);
      await loadProfile();
    } catch (err) {
      setError(err.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await changePassword(passwordForm);
      setSuccess("Đổi mật khẩu thành công");
      setChangePasswordMode(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteAccount(deletePassword);
      localStorage.clear();
      onLogout();
    } catch (err) {
      setError(err.message || "Xóa tài khoản thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước file không được vượt quá 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Chỉ chấp nhận file ảnh");
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      // For now, we'll just store the base64 string
      // In production, you'd upload to a server and get back a URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        await updateProfile({ personalPhoto: base64String });
        setSuccess("Cập nhật ảnh đại diện thành công");
        setAvatarFile(null);
        setAvatarPreview(null);
        await loadProfile();
      };
      reader.readAsDataURL(avatarFile);
    } catch (err) {
      setError(err.message || "Cập nhật ảnh thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.clear();
      onLogout();
    } catch (err) {
      setError(err.message || "Đăng xuất thất bại");
    }
  };

  if (loading && !profile) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Hệ thống Sơ yếu lý lịch</h1>
          <button onClick={handleLogout} className="logout-btn">
            Đăng xuất
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="navigation-menu">
          <button
            className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            📊 Tổng quan
          </button>
          <button
            className={`nav-item ${activeSection === "basic-info" ? "active" : ""}`}
            onClick={() => setActiveSection("basic-info")}
          >
            👤 Thông tin cơ bản
          </button>
          <button
            className={`nav-item ${activeSection === "contact" ? "active" : ""}`}
            onClick={() => setActiveSection("contact")}
          >
            📞 Thông tin liên hệ
          </button>
          <button
            className={`nav-item ${activeSection === "identity" ? "active" : ""}`}
            onClick={() => setActiveSection("identity")}
          >
            🪪 Giấy tờ định danh
          </button>
          <button
            className={`nav-item ${activeSection === "career" ? "active" : ""}`}
            onClick={() => setActiveSection("career")}
          >
            🎯 Mục tiêu nghề nghiệp
          </button>
          <button
            className={`nav-item ${activeSection === "references" ? "active" : ""}`}
            onClick={() => setActiveSection("references")}
          >
            👥 Người tham chiếu
          </button>
          <button
            className={`nav-item ${activeSection === "education" ? "active" : ""}`}
            onClick={() => setActiveSection("education")}
          >
            🎓 Học vấn
          </button>
          <button
            className={`nav-item ${activeSection === "certificates" ? "active" : ""}`}
            onClick={() => setActiveSection("certificates")}
          >
            📜 Chứng chỉ
          </button>
          <button
            className={`nav-item ${activeSection === "online-courses" ? "active" : ""}`}
            onClick={() => setActiveSection("online-courses")}
          >
            💻 Khóa học online
          </button>
          <button
            className={`nav-item ${activeSection === "experience" ? "active" : ""}`}
            onClick={() => setActiveSection("experience")}
          >
            💼 Kinh nghiệm làm việc
          </button>
          <button
            className={`nav-item ${activeSection === "freelance" ? "active" : ""}`}
            onClick={() => setActiveSection("freelance")}
          >
            🚀 Dự án freelance
          </button>
          <button
            className={`nav-item ${activeSection === "technical-skills" ? "active" : ""}`}
            onClick={() => setActiveSection("technical-skills")}
          >
            🛠️ Kỹ năng kỹ thuật
          </button>
          <button
            className={`nav-item ${activeSection === "soft-skills" ? "active" : ""}`}
            onClick={() => setActiveSection("soft-skills")}
          >
            🤝 Kỹ năng mềm
          </button>
          <button
            className={`nav-item ${activeSection === "language-skills" ? "active" : ""}`}
            onClick={() => setActiveSection("language-skills")}
          >
            🌐 Kỹ năng ngôn ngữ
          </button>
          <button
            className={`nav-item ${activeSection === "tool-skills" ? "active" : ""}`}
            onClick={() => setActiveSection("tool-skills")}
          >
            🔧 Kỹ năng công cụ
          </button>
          <button
            className={`nav-item ${activeSection === "projects" ? "active" : ""}`}
            onClick={() => setActiveSection("projects")}
          >
            📁 Dự án
          </button>
          <button
            className={`nav-item ${activeSection === "achievements" ? "active" : ""}`}
            onClick={() => setActiveSection("achievements")}
          >
            🏆 Thành tích
          </button>
          <button
            className={`nav-item ${activeSection === "activities" ? "active" : ""}`}
            onClick={() => setActiveSection("activities")}
          >
            🎯 Hoạt động
          </button>
          <button
            className={`nav-item ${activeSection === "volunteering" ? "active" : ""}`}
            onClick={() => setActiveSection("volunteering")}
          >
            ❤️ Tình nguyện
          </button>
          <button
            className={`nav-item ${activeSection === "publications" ? "active" : ""}`}
            onClick={() => setActiveSection("publications")}
          >
            📚 Công bố
          </button>
          <button
            className={`nav-item ${activeSection === "patents" ? "active" : ""}`}
            onClick={() => setActiveSection("patents")}
          >
            💡 Bằng sáng chế
          </button>
          <button
            className={`nav-item ${activeSection === "resume-builder" ? "active" : ""}`}
            onClick={() => setActiveSection("resume-builder")}
          >
            📄 Tạo sơ yếu lý lịch
          </button>
          <button
            className={`nav-item ${activeSection === "sessions" ? "active" : ""}`}
            onClick={() => setActiveSection("sessions")}
          >
            🔐 Quản lý phiên
          </button>
          <button
            className={`nav-item ${activeSection === "account" ? "active" : ""}`}
            onClick={() => setActiveSection("account")}
          >
            ⚙️ Tài khoản
          </button>
        </div>

        {/* Content Section */}
        <div className="content-section">
          {activeSection === "dashboard" && <Dashboard onClose={() => setActiveSection("account")} />}
          {activeSection === "basic-info" && <BasicInformation onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "contact" && <ContactInformation onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "identity" && <IdentityInformation onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "career" && <CareerObjective onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "references" && <References onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "education" && <Education onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "certificates" && <Certificates onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "online-courses" && <OnlineCourses onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "experience" && <Experience onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "freelance" && <FreelanceProjects onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "technical-skills" && <TechnicalSkills onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "soft-skills" && <SoftSkills onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "language-skills" && <LanguageSkills onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "tool-skills" && <ToolSkills onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "projects" && <Projects onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "achievements" && <Achievements onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "activities" && <Activities onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "volunteering" && <Volunteering onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "publications" && <Publications onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "patents" && <Patents onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "resume-builder" && <ResumeBuilder onClose={() => setActiveSection("dashboard")} />}
          {activeSection === "sessions" && <SessionManagement onClose={() => setActiveSection("dashboard")} />}
          
          {activeSection === "account" && (
            <div className="account-section">
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

        {profile && (
          <div className="profile-content">
            <div className="account-info">
              <h2>Thông tin tài khoản</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Email:</label>
                  <span>{profile.user.email}</span>
                </div>
                <div className="info-item">
                  <label>Ngày tạo:</label>
                  <span>
                    {new Date(profile.user.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="info-item">
                  <label>Trạng thái:</label>
                  <span>
                    {profile.user.isEmailVerified
                      ? "Đã xác thực"
                      : "Chưa xác thực"}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <div className="section-header">
                <h2>Thông tin cá nhân</h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="edit-btn"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>

              <div className="avatar-section">
                <div className="avatar-display">
                  {profile.profile?.personalPhoto || avatarPreview ? (
                    <img
                      src={avatarPreview || profile.profile.personalPhoto}
                      alt="Avatar"
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {profile.user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {editMode && (
                  <div className="avatar-upload">
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={loading}
                      className="avatar-input"
                    />
                    <label htmlFor="avatar" className="avatar-label">
                      Chọn ảnh
                    </label>
                    {avatarFile && (
                      <button
                        onClick={handleAvatarUpload}
                        disabled={loading}
                        className="upload-btn"
                      >
                        Tải lên
                      </button>
                    )}
                  </div>
                )}
              </div>

              {!editMode && (
                <div className="avatar-section">
                  <div className="avatar-display">
                    {profile.profile?.personalPhoto ? (
                      <img
                        src={profile.profile.personalPhoto}
                        alt="Avatar"
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {profile.user.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="profile-form">
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleProfileChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleProfileChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Giới tính</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleProfileChange}
                      disabled={loading}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleProfileChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Địa chỉ hiện tại</label>
                    <input
                      type="text"
                      name="currentAddress"
                      value={form.currentAddress}
                      onChange={handleProfileChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Ảnh đại diện (URL)</label>
                    <input
                      type="text"
                      name="personalPhoto"
                      value={form.personalPhoto}
                      onChange={handleProfileChange}
                      disabled={loading}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                      className="cancel-btn"
                    >
                      Hủy
                    </button>
                    <button type="submit" disabled={loading}>
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-display">
                  {profile.profile ? (
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Họ và tên:</label>
                        <span>{profile.profile.fullName || "Chưa cập nhật"}</span>
                      </div>
                      <div className="info-item">
                        <label>Ngày sinh:</label>
                        <span>
                          {profile.profile.dateOfBirth
                            ? new Date(
                                profile.profile.dateOfBirth
                              ).toLocaleDateString("vi-VN")
                            : "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="info-item">
                        <label>Giới tính:</label>
                        <span>
                          {profile.profile.gender === "male"
                            ? "Nam"
                            : profile.profile.gender === "female"
                            ? "Nữ"
                            : profile.profile.gender === "other"
                            ? "Khác"
                            : "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="info-item">
                        <label>Số điện thoại:</label>
                        <span>
                          {profile.profile.phoneNumber || "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="info-item">
                        <label>Địa chỉ:</label>
                        <span>
                          {profile.profile.currentAddress || "Chưa cập nhật"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="no-data">Chưa có thông tin cá nhân</p>
                  )}
                </div>
              )}
            </div>

            <div className="profile-section">
              <div className="section-header">
                <h2>Bảo mật</h2>
                {!changePasswordMode && (
                  <button
                    onClick={() => setChangePasswordMode(true)}
                    className="edit-btn"
                  >
                    Đổi mật khẩu
                  </button>
                )}
              </div>

              {changePasswordMode && (
                <form onSubmit={handleChangePassword} className="profile-form">
                  <div className="form-group">
                    <label>Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setChangePasswordMode(false)}
                      disabled={loading}
                      className="cancel-btn"
                    >
                      Hủy
                    </button>
                    <button type="submit" disabled={loading}>
                      Đổi mật khẩu
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="profile-section danger-zone">
              <h2>Vùng nguy hiểm</h2>
              <p>Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn.</p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="delete-btn"
              >
                Xóa tài khoản
              </button>

              {showDeleteConfirm && (
                <div className="delete-confirm">
                  <p>Bạn có chắc chắn muốn xóa tài khoản?</p>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu để xác nhận"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    disabled={loading}
                  />
                  <div className="form-actions">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword("");
                      }}
                      disabled={loading}
                      className="cancel-btn"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading || !deletePassword}
                      className="confirm-delete-btn"
                    >
                      Xóa tài khoản
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

    <style jsx>{`
      .profile-page {
        min-height: 100vh;
        background: #f8fafc;
        padding: 20px;
      }

      .profile-container {
        max-width: 1400px;
        margin: 0 auto;
      }

      .profile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      }

      .profile-header h1 {
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;
        margin: 0;
      }

      .logout-btn {
        padding: 10px 20px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .logout-btn:hover {
        background: #dc2626;
      }

      .navigation-menu {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
        margin-bottom: 24px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      }

      .nav-item {
        padding: 12px 16px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
      }

      .nav-item:hover {
        background: #e2e8f0;
        transform: translateY(-2px);
      }

      .nav-item.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: #667eea;
      }

      .content-section {
        min-height: 400px;
      }

      .account-section {
        background: white;
        border-radius: 12px;
        padding: 24px;
        border: 1px solid #e2e8f0;
      }

      @media (max-width: 768px) {
        .navigation-menu {
          grid-template-columns: repeat(2, 1fr);
        }

        .profile-header {
          flex-direction: column;
          gap: 12px;
          text-align: center;
        }
      }
    `}</style>
  );
}
