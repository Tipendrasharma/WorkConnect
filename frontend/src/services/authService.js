import api from "./api";

export const registerWorker = (formData) =>
  api.post("/auth/register/worker", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const registerCustomer = (data) => api.post("/auth/register/customer", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const getMe = () => api.get("/auth/me");
