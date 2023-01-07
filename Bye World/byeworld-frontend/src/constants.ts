import axios from "axios";
import { lsGetSessionId } from "./utils/helpers";

export const constants = {
  apiName: "https://localhost:7294",
};

const axiosInstace = axios.create({
  baseURL: constants.apiName,
});

axiosInstace.interceptors.request.use(
  (config) => {
    let sessionId = lsGetSessionId();
    if (sessionId) {
      config["headers"] = config.headers ?? {};
      // @ts-ignore
      config.headers["Authorization"] = `SessionId ${sessionId}`;
      console.log("interceptor");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = axiosInstace;
