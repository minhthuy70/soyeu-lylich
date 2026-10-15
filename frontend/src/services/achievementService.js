const API_URL = "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (response) => {
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message[0]
        : result.message || "Thao tác thất bại."
    );
  }
  
  return result;
};

// Achievement CRUD operations
export async function getAchievements(category = null, level = null) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (level) params.append('level', level);
  
  const url = `${API_URL}/achievements${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function getAchievement(id) {
  const response = await fetch(`${API_URL}/achievements/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function createAchievement(data) {
  const response = await fetch(`${API_URL}/achievements`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function updateAchievement(id, data) {
  const response = await fetch(`${API_URL}/achievements/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function deleteAchievement(id) {
  const response = await fetch(`${API_URL}/achievements/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}
