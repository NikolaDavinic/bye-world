import { User } from "../model/User";

interface Session {
  id: string;
  expires: string;
}

export const shortenText = (text: string, length: number) => {
  return text.length > length ? text.substring(length) + "..." : text;
};

export const getFileName = (path: string) => {
  const extension = path.slice(
    (Math.max(0, path.lastIndexOf(".")) || Infinity) + 1
  );
  const name = path
    .slice(0, -extension.length - 31)
    .substring("https:/localhost:7017/cvs/".length);

  return name + extension;
};

export const lsGetSession: () => Session | null = () => {
  const lssession = localStorage.getItem("session");
  if (!lssession) return null;
  return JSON.parse(lssession);
};

export const lsSetSession = (session: Session) =>
  localStorage.setItem("session", JSON.stringify(session));

export const lsRemoveSession = () => localStorage.removeItem("session");

export const lsGetUser = () => JSON.parse(localStorage.getItem("user") || "{}");

export const lsSetUser = (user: User) =>
  localStorage.setItem("user", JSON.stringify(user));

export const lsRemoveUser = () => localStorage.removeItem("user");
