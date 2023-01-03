import { Listing } from "./Listing";
import { Review } from "./Review";

export interface Company {
  id?: number;
  name: string;
  description: string;
  logoUrl?: string;
  email: string;
  vat: string;
  address: string;
  reviewsCount?: number;
  listingsCount?: number;
  avgReview?: number;
  listings?: Listing[];
  reviews?: Review[];
}
