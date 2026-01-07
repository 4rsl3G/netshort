import { api } from "./client";

export const ns = {
  recommend: (params) => api.get("/netshort/recommend", { params }),
  member: (params) => api.get("/netshort/member", { params }),
  search: (params) => api.get("/netshort/search", { params }),
  episodes: (shortPlayId) => api.get(`/netshort/episodes/${shortPlayId}`),
  videoUrl: (params) => api.get("/netshort/video", { params }),
};