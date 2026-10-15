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

// Project CRUD operations
export async function getProjects() {
  const response = await fetch(`${API_URL}/projects`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function getProject(id) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function createProject(data) {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function updateProject(id, data) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function deleteProject(id) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function reorderProjects(projectOrders) {
  const response = await fetch(`${API_URL}/projects/reorder`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ projectOrders }),
  });

  return handleResponse(response);
}

// Project Image CRUD operations
export async function getProjectImages(projectId) {
  const url = projectId 
    ? `${API_URL}/project-images?projectId=${projectId}`
    : `${API_URL}/project-images`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function getProjectImage(id) {
  const response = await fetch(`${API_URL}/project-images/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function createProjectImage(data) {
  const response = await fetch(`${API_URL}/project-images`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function updateProjectImage(id, data) {
  const response = await fetch(`${API_URL}/project-images/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function deleteProjectImage(id) {
  const response = await fetch(`${API_URL}/project-images/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function reorderProjectImages(projectId, imageIds) {
  const response = await fetch(`${API_URL}/project-images/reorder`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ projectId, imageIds }),
  });

  return handleResponse(response);
}

export async function setProjectImageThumbnail(id) {
  const response = await fetch(`${API_URL}/project-images/${id}/set-thumbnail`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}
