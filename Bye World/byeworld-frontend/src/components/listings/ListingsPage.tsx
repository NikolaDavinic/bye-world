import {
  Button,
  FormControlLabel,
  FormGroup,
  Icon,
  Switch,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../constants";
import { useAuthContext } from "../../contexts/auth.context";
import { Listing } from "../../model/Listing";
import { Skill } from "../../model/Skill";
import { AddListingModal } from "../AddListingModal/AddListingModal";
import { ListingsList } from "../common/ListingsList/ListingsList";
export interface ListingDTO {
  id: number;
  title: string;
  description: string;
  requirements: Skill[];
  postingDate: Date;
  closingDate: Date;
  companyName: string;
  companyLogoUrl?: string;
  companyId: string;
  cityName?: string;
  isFavorite?: boolean;
}
export const Listings: React.FC = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [skill, setSkill] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [seniority, setSeniority] = useState<string>("");
  const [sortNewest, setSortNewest] = useState<Boolean>(true);
  const [includeExpired, setIncludeExpired] = useState<Boolean>(false);
  const [listings, setListings] = useState<ListingDTO[]>([]);

  const { isAuthenticated } = useAuthContext();

  //Paging
  //Increment of listings number
  const increment = 3;
  //Starting number of listings
  const [count, setCount] = useState<number>(3);

  const onFilter = () => {
    getFilteredListings(
      keyword,
      city,
      skill,
      seniority,
      sortNewest,
      includeExpired,
      count
    );
  };

  const toggleFavoriteListing = (id: number) => {
    setListings(
      listings.map((listing) => {
        if (listing.id === id) {
          return { ...listing, isFavorite: !Boolean(listing.isFavorite) };
        } else {
          return listing;
        }
      })
    );
  };

  const onSort = (newest: Boolean) => {
    if (sortNewest != newest) setSortNewest(newest);
  };

  const onChangeExpired = () => {
    setIncludeExpired((prevExpired) => !prevExpired);
  };

  const fetchMoreListings = () => {
    setCount((prevCount) => prevCount + increment);
    onFilter();
  };

  async function getFilteredListings(
    keyword: string,
    city: string,
    skill: string,
    seniority: string,
    sortNewest: Boolean,
    includeExpired: Boolean,
    take: Number
  ) {
    const response = await api.get("/listing/filter", {
      params: {
        keyword,
        city,
        skill,
        seniority,
        sortNewest,
        includeExpired,
        take,
      },
    });
    console.log(response.data);
    setListings(response.data);
  }
  useEffect(() => {
    onFilter();
  }, [sortNewest, includeExpired]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      onFilter();
    }
  };
  // Modal testing
  const [open, setOpen] = React.useState(false);

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {isAuthenticated() && (
        <AddListingModal isOpen={open} handleModalClose={handleModalClose} />
      )}
      <div className="h-1/4 flex flex-col px-4 py-4 space-y-4 bg-white drop-shadow-lg">
        <h1 className="font-bold">Listings search</h1>
        <div className="flex flex-row justify-center gap-6">
          <TextField
            id="keyword"
            label="Keyword search"
            variant="outlined"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
            value={keyword}
          />
          <TextField
            id="skill"
            label="Skill"
            variant="outlined"
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
            value={skill}
          />
          <TextField
            id="city"
            label="City"
            variant="outlined"
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
            value={city}
          />
          <TextField
            id="seniority"
            label="Seniority"
            variant="outlined"
            onChange={(e) => setSeniority(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
            value={seniority}
          />
          <Button
            variant="contained"
            onClick={() => onFilter()}
            startIcon={
              <Icon
                sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                className="material-symbols-outlined"
              >
                filter_alt
              </Icon>
            }
          >
            Filter
          </Button>
        </div>
        <div className="flex flex-row gap-5 justify-center">
          <Button
            variant={sortNewest ? "contained" : "outlined"}
            onClick={() => onSort(true)}
          >
            Newest
          </Button>
          <Button
            variant={sortNewest ? "outlined" : "contained"}
            onClick={() => onSort(false)}
          >
            Expiring soon
          </Button>
          <FormGroup>
            <FormControlLabel
              labelPlacement="end"
              control={
                <Switch
                  value={includeExpired}
                  onChange={(e) => onChangeExpired()}
                />
              }
              label="Include Expired"
            />
          </FormGroup>
          {/* Testing new listing modal, delete later */}
          {isAuthenticated() && (
            <Button variant="text" onClick={() => handleModalOpen()}>
              New Listing
            </Button>
          )}
        </div>
      </div>
      <div className="bg-gray-100 h-full min-h-full ">
        <ListingsList
          listings={listings}
          toggleFavorite={toggleFavoriteListing}
        />
      </div>
      <div className="flex  m-5  px-60">
        <Button
          fullWidth
          variant={"contained"}
          onClick={() => fetchMoreListings()}
        >
          Show more
        </Button>
      </div>
    </div>
  );
};
