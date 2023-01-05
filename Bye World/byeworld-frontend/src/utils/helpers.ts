import { User } from "../model/User";

export const shortenText = (text: string, length: number) => {
  return text.length > length ? text.substring(length) + "..." : text;
};

export const lsGetSessionId = () => localStorage.getItem("session-id");

export const lsSetSessionId = (token: string) =>
  localStorage.setItem("session-id", token);

export const lsRemoveSessionId = () => localStorage.removeItem("session-id");

export const lsGetUser = () => JSON.parse(localStorage.getItem("user") || "{}");

export const lsSetUser = (user: User) =>
  localStorage.setItem("user", JSON.stringify(user));

export const lsRemoveUser = () => localStorage.removeItem("user");
