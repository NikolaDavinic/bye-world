import { City } from "./City";
import { Company } from "./Company";
import { RequiresSkill } from "./RequiresSkill";

export interface Listing {
  id: number;
  title: string;
  description: string;
  requirements: RequiresSkill[];
  postingDate: Date;
  closingDate: Date;
  company?: Company;
  city?: City;
}
