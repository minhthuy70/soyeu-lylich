export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      profile: 'Profile',
      projects: 'Projects',
      achievements: 'Achievements',
      settings: 'Settings',
      logout: 'Logout',
    },
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    // Profile
    profile: {
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      education: 'Education',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
    },
    // Auth
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
    },
  },
  vi: {
    // Navigation
    nav: {
      dashboard: 'Bảng điều khiển',
      profile: 'Hồ sơ',
      projects: 'Dự án',
      achievements: 'Thành tích',
      settings: 'Cài đặt',
      logout: 'Đăng xuất',
    },
    // Common
    common: {
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      edit: 'Chỉnh sửa',
      add: 'Thêm',
      search: 'Tìm kiếm',
      loading: 'Đang tải...',
      error: 'Lỗi',
      success: 'Thành công',
    },
    // Profile
    profile: {
      personalInfo: 'Thông tin cá nhân',
      contactInfo: 'Thông tin liên hệ',
      education: 'Học vấn',
      experience: 'Kinh nghiệm',
      skills: 'Kỹ năng',
      projects: 'Dự án',
    },
    // Auth
    auth: {
      login: 'Đăng nhập',
      register: 'Đăng ký',
      email: 'Email',
      password: 'Mật khẩu',
      forgotPassword: 'Quên mật khẩu?',
      resetPassword: 'Đặt lại mật khẩu',
    },
  },
};

export function t(key, locale = 'en') {
  const keys = key.split('.');
  let value = translations[locale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}
