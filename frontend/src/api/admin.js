import api from "./axios";

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchAllInterns = async (token) => {
  const res = await api.get("/users/admin/interns", authHeader(token));
  return res.data.data;
};

export const fetchInternAttendance = async (id, month, token) => {
  const res = await api.get(`/users/admin/interns/${id}/attendance?month=${month}`, authHeader(token));
  return res.data.data;
};

export const fetchInternLogs = async (id, token) => {
  const res = await api.get(`/users/admin/interns/${id}/logs`, authHeader(token));
  return res.data.data;
};

export const deleteIntern = async (id, token) => {
  const res = await api.delete(`/users/admin/interns/${id}`, authHeader(token));
  return res.data;
};

export const updateInternOjtHours = async (id, data, token) => {
  const res = await api.put(`/users/admin/interns/${id}/ojt-hours`, data, authHeader(token));
  return res.data;
};