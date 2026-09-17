import api from "./api";

export const getWorkerReviews = (workerId) => api.get(`/reviews/${workerId}`);
export const createReview = (data) => api.post("/reviews", data);
export const likeReview = (id) => api.put(`/reviews/${id}/like`);
export const reportReview = (id, reason) => api.put(`/reviews/${id}/report`, { reason });
