import { Skill } from "./Skill";
import { User } from "./User";

export interface HasSkill {
  user?: User;
  skill?: Skill;
  proficiency: string;
}
