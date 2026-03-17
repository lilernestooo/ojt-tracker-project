import api from "./axios";

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchOjtHours = async (token) => {
  const res = await api.get("/ojt-hours", authHeader(token));
  return res.data.data;
};

export const updateOjtHours = async ({ required_hours, previous_hours }, token) => {
  const res = await api.put("/ojt-hours", { required_hours, previous_hours }, authHeader(token));
  return res.data.data;
};