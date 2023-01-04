import { User } from "../model/User";

export const shortenText = (text: string, length: number) => {
  return text.length > length ? text.substring(length) + "..." : text;
};

export const getSessionId = () => localStorage.getItem("session-id");

export const setSessionId = (token: string) =>
  localStorage.setItem("session-id", token);

export const removeSessionId = () => localStorage.removeItem("session-id");

export const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");

export const setUser = (user: User) =>
  localStorage.setItem("user", JSON.stringify(user));

export const removeUser = () => localStorage.removeItem("user");
