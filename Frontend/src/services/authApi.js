const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const buildHeaders = (token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    const message = payload.error || "Request failed.";
    throw new Error(message);
  }

  return payload;
};

export const authApi = {
  signup: ({ fullName, email, password, role }) =>
    request("/auth/signup", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ fullName, email, password, role }),
    }),

  login: ({ email, password }) =>
    request("/auth/login", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ email, password }),
    }),

  me: (token) =>
    request("/auth/me", {
      method: "GET",
      headers: buildHeaders(token),
    }),
};
