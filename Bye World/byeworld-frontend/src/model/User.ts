import { HasSkill } from "./HasSkill";

export interface User {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  skills?: HasSkill[];
  companiesCount?: number;
  favListingsCount?: number;
  reviewsCount?: number;
  cv?: string;
  role?: "User" | "Company";
}
