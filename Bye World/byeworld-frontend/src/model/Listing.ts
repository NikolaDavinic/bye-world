import { City } from "./City";
import { Company } from "./Company";
import { RequiresSkill } from "./RequiresSkill";

export interface Listing {
    ID: number;
    Title: string;
    Description: string;
    Requirements: RequiresSkill[];
    PostingDate: Date;
    ClosingDate: Date;
    Company?: Company;
    City?: City;
}
