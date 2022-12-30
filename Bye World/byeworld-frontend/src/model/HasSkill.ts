import { Skill } from "./Skill";
import { User } from "./User";

export interface HasSkill {
    User?: User;
    Skill?: Skill;
    Proficiency: string;
}