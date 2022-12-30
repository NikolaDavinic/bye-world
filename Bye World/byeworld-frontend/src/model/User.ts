import { HasSkill } from "./HasSkill";

export interface User {
  Id: number;
  Name: string;
  Email: string;
  Phone: string;
  ImageUrl: string;
  UserType: string;
  Skills: HasSkill[];
}
