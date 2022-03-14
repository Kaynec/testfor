import axios from 'axios';
import { useMentorStore } from '@/store';
import { baseUrl } from '@/api/apiclient';
const alertify = require('../../../assets/alertifyjs/alertify');

export const MentorInstance = axios.create({
  baseURL: baseUrl,
  // 5 minutes
  timeout: 300000,
  headers: {}
});
MentorInstance.interceptors.request.use((config) => {
  const token = useMentorStore().getters.getMentorToken;
  if (token) config.headers.token = `${token}`;
  return config;
});
MentorInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.data && error.response.data.message)
      alertify.error(error.response.data.message);
    return Promise.reject(error);
  }
);
