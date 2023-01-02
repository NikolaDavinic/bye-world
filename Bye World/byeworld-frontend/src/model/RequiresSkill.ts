import { Listing } from "./Listing";
import { Skill } from "./Skill";

export interface RequiresSkill {
  listing?: Listing;
  skill?: Skill;
  proficiency: string;
}
