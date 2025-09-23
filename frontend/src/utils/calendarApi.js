import axios from 'axios';
import { BACKEND_URL } from '../utils/constant.js';

const API = axios.create({
  baseURL: `${BACKEND_URL}/calendar`,
  withCredentials: true,
});

export const fetchBookedDates = async (vendorId, month, year) => {
  const { data } = await API.get(`/booked-dates/${vendorId}`, {
    params: { month, year },
  });
  return data;
};