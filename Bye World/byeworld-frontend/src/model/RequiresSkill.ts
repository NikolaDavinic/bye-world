import { Listing } from "./Listing";
import { Skill } from "./Skill";

export interface RequiresSkill {
    Listing?: Listing;
    Skill?: Skill;
    Proficiency: string;
}
