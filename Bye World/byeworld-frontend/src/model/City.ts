import { Listing } from "./Listing";

export interface City {
  id: number;
  name: string;
  listing?: Listing;
}
