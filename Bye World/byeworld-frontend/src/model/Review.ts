import { Company } from "./Company";
import { User } from "./User";

export interface Review {
    Id: number;
    Description: string;
    Value: number;
    Date: Date;
    Company?: Company;
    User?: User;
}
