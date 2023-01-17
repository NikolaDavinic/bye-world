import axios from "axios";
import { lsGetSession, lsRemoveSession } from "./utils/helpers";

export const constants = {
  apiName: "https://localhost:7294",
};

const axiosInstace = axios.create({
  baseURL: constants.apiName,
});

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
