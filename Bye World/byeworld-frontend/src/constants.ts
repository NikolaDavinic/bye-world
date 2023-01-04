import axios from "axios";

export const constants = {
  apiName: "https://localhost:7294",
};

export const api = axios.create({
  baseURL: constants.apiName,
});
