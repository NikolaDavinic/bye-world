import { HasSkill } from "./HasSkill";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  userType: string;
  skills: HasSkill[];
}
