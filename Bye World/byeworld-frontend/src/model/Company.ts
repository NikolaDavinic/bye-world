import { Listing } from "./Listing";
import { Review } from "./Review";

export interface Company {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  phone: string;
  email: string;
  vat: number;
  adress: string;
  listings: Listing[];
  reviews: Review[];
}
