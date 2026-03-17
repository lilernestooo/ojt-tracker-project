import api from "./axios";

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchLogs = async (token) => {
  const res = await api.get("/logs", authHeader(token));
  return res.data;
};

export const createLog = async (form, token) => {
  const res = await api.post("/logs", form, authHeader(token));
  return res.data;
};

export const updateLog = async (id, form, token) => {
  const res = await api.put(`/logs/${id}`, form, authHeader(token));
  return res.data;
};

export const deleteLog = async (id, token) => {
  const res = await api.delete(`/logs/${id}`, authHeader(token));
  return res.data;
};