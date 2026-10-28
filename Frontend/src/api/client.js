import axios from "axios";

const apiBaseUrl = import.meta.env.API_URL || "/api";
const api = axios.create({ baseURL: apiBaseUrl, withCredentials: true });
const refreshClient = axios.create({ baseURL: apiBaseUrl, withCredentials: true });

let refreshRequest = null;

function clearExpiredSession() {
  localStorage.removeItem("snitch_user");
  localStorage.removeItem("snitch_access_token");
  window.dispatchEvent(new Event("snitch:session-expired"));
}

function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = refreshClient
      .post("/refresh-token")
      .then(({ data }) => {
        const { accessToken, user } = data.data;
        localStorage.setItem("snitch_access_token", accessToken);
        if (user) localStorage.setItem("snitch_user", JSON.stringify(user));
        return accessToken;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }
  return refreshRequest;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("snitch_access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isAuthRequest = ["/login", "/users", "/refresh-token"].some((path) =>
      request?.url?.endsWith(path),
    );

    if (!isUnauthorized || request?._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    request._retry = true;
    try {
      const accessToken = await refreshAccessToken();
      request.headers.Authorization = `Bearer ${accessToken}`;
      return api(request);
    } catch (refreshError) {
      clearExpiredSession();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
