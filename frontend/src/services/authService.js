const API_URL = "http://localhost:3000";

export async function registerUser(data) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message[0]
        : result.message || "Đăng ký thất bại."
    );
  }

  return result;
}

export async function loginUser(data) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message[0]
        : result.message || "Đăng nhập thất bại."
    );
  }

  return result;
}

export async function logoutUser() {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message[0]
        : result.message || "Đăng xuất thất bại."
    );
  }

  return result;
}

export async function forgotPassword(data) {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message[0]
        : result.message || "Gửi yêu cầu thất bại."
    );
  }

  return result;
}

export async function resetPassword(data) {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message[0]
        : result.message || "Đặt lại mật khẩu thất bại."
    );
  }

  return result;
}

export async function getProfile() {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message[0]
        : result.message || "Lấy thông tin thất bại."
    );
  }

  return result;
}

export async function updateProfile(data) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message[0]
        : result.message || "Cập nhật thông tin thất bại."
    );
  }

  return result;
}

export async function changePassword(data) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/profile/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message[0]
        : result.message || "Đổi mật khẩu thất bại."
    );
  }

  return result;
}

export async function deleteAccount(password) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/profile`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message[0]
        : result.message || "Xóa tài khoản thất bại."
    );
  }

  return result;
}
