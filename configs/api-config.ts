import { apiRoutes } from "@/features/auth/utils/auth";
import { cookiesStorage } from "@/lib/storage";

import { env } from "./env";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  __isRetryRequest?: boolean;
}

// refresh token function
const refreshAccessToken = async () => {
  const refreshToken = cookiesStorage.getItem("refreshToken");

  try {
    const response = await axios.post(
      `${env.API_URL}/${apiRoutes.REFRESH_TOKEN}`,
      { refreshToken }
    );

    const accessToken = response.data.data.accessToken;

    return accessToken;
  } catch (error) {
    // throw new Error('Failed to refresh token');
  }
};

const api = axios.create({
  baseURL: env.API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = cookiesStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {}
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && config && !config.__isRetryRequest) {
      try {
        // mark the request as a retry attempt
        config.__isRetryRequest = true;

        // request new accesstoken using refreshtoken
        const accessToken = await refreshAccessToken();
        cookiesStorage.setItem("token", accessToken);

        error.config!.headers.Authorization = `Bearer ${accessToken}`;

        // retry original request with new accesstoken
        return api(error.config!);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
