// src/api/attendance.js
import api from "./axios";

export const fetchAttendance = async (month, token) => {
  const res = await api.get(`/attendance?month=${month}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const timeIn = async (token) => {
  const res = await api.post("/attendance/timein", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const timeOut = async (token) => {
  const res = await api.post("/attendance/timeout", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const markAbsent = async (date, token) => {
  const res = await api.post(
    "/attendance/absent",
    { date },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};