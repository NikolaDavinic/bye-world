import { Listing } from "./Listing";
import { Review } from "./Review";

export interface Company {
    ID: number;
    Name: string;
    Description: string;
    LogoUrl: string;
    Phone: string;
    Email: string;
    VAT: number;
    Adress: string;
    Listings: Listing[];
    Reviews: Review[];
}