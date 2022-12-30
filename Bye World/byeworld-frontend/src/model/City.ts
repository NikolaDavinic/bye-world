import { Listing } from "./Listing";

export interface City {
    Id: number;
    Name: string;
    Listing?: Listing;
}
