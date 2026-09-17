import api from "./api";

// params: { lat, lng, radius, category, keyword, sortBy, minExperience, verifiedOnly, page, limit }
export const searchWorkers = (params) => api.get("/workers", { params });

export const getFeaturedWorkers = () => api.get("/workers/featured");

export const getWorkerById = (id) => api.get(`/workers/${id}`);

export const updateWorkerProfile = (formData) =>
  api.put("/workers/update", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateAvailability = (availability) => api.put("/workers/availability", { availability });

export const deleteMyAccount = () => api.delete("/workers");

export const getWorkerDashboard = () => api.get("/workers/dashboard/me");

export const logContact = (workerId, type) => api.post(`/workers/${workerId}/contact`, { type });

export const getCategories = () => api.get("/categories");
