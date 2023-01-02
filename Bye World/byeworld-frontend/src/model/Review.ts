import { Company } from "./Company";
import { User } from "./User";

export interface Review {
  id: number;
  description: string;
  value: number;
  date: Date;
  company?: Company;
  user?: User;
}
