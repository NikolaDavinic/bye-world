import axios from "axios";
import { getSessionId } from "./utils/helpers";

export const constants = {
  apiName: "https://localhost:7294",
};

const axiosInstace = axios.create({
  baseURL: constants.apiName,
});

axiosInstace.interceptors.request.use(
  (config) => {
    let sessionId = getSessionId();
    console.log("interceptor");
    if (sessionId) {
      config["headers"] = config.headers ?? {};
      // @ts-ignore
      config.headers["Authorization"] = `SessionId ${getSessionId()}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = axiosInstace;
