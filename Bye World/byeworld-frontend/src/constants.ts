import axios from "axios";
import { lsGetSession } from "./utils/helpers";

export const constants = {
  apiName: "https://localhost:7294",
  upServiceName: "https://localhost:7017",
};

const axiosInstace = axios.create({
  baseURL: constants.apiName,
});

const axiosInstance2 = axios.create({
  baseURL: constants.upServiceName,
});

axiosInstance2.interceptors.request.use(
  (config) => {
    let session = lsGetSession();
    if (session) {
      config["headers"] = config.headers ?? {};
      // @ts-ignore
      config.headers["Authorization"] = `SessionId ${session.id}`;
      console.log("interceptor");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstace.interceptors.request.use(
  (config) => {
    let session = lsGetSession();
    if (session) {
      // if (new Date(session.expires) > new Date()) {
      //   lsRemoveSession();
      //   return config;
      // }

      config["headers"] = config.headers ?? {};
      // @ts-ignore
      config.headers["Authorization"] = `SessionId ${session.id}`;
      console.log("interceptor");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = axiosInstace;
export const upService = axiosInstance2;
