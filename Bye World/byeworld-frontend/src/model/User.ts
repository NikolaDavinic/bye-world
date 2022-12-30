import { HasSkill } from "./HasSkill";

export interface User {
    Id: number;
    Name: string;
    Email: string;
    Phone: string;
    ImageUrl: string;
    PasswordHash: string;
    UserType: string;
    Skills: HasSkill[];
  }
  