import {
  Box,
  Button,
  CircularProgress,
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
  const { isAuthenticated, userIsCompany } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);

  //Paging
  //Increment of listings number
  const increment = 3;
  //Starting number of listings
  const [count, setCount] = useState<number>(3);

  const onFilter = (skip: number) => {
    getFilteredListings(
      keyword,
      city,
      skill,
      seniority,
      sortNewest,
      includeExpired,
      skip,
      increment
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
    onFilter(listings.length);
  };

  async function getFilteredListings(
    keyword: string,
    city: string,
    skill: string,
    seniority: string,
    sortNewest: Boolean,
    includeExpired: Boolean,
    skip: Number,
    take: Number
  ) {
    setLoading(true);
    if (skip === 0) {
      setListings([]);
    }
    api
      .get<ListingDTO[]>("/listing/filter", {
        params: {
          keyword,
          city,
          skill,
          seniority,
          sortNewest,
          includeExpired,
          take,
          skip,
        },
      })
      .then((response) => {
        setLoading(false);
        setListings((prev) => {
          if (skip === 0) {
            return [...response.data];
          }
          const newitems = response.data.filter(
            (item) => prev.findIndex((t) => t.id === item.id) === -1
          );
          return [...prev, ...newitems];
        });
      });
  }

  useEffect(() => {
    onFilter(0);
  }, [sortNewest, includeExpired]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      onFilter(0);
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
            onClick={() => onFilter(0)}
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
          {isAuthenticated() && userIsCompany() && (
            <Button variant="outlined" onClick={() => handleModalOpen()}>
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
      <div>
        {loading && (
          <Box className="flex items-center justify-center">
            <CircularProgress color="primary" />
          </Box>
        )}
      </div>
      <div className="flex m-5 gap-4 px-60 flex-row">
        <Button
          fullWidth
          variant={"contained"}
          onClick={() => fetchMoreListings()}
        >
          Show more
        </Button>
        <Button
          variant="outlined"
          onClick={(ev) =>
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })}
          endIcon={
            <Icon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
              className="material-symbols-outlined"
            >
              arrow_upward
            </Icon>
          }
        >
        </Button>
      </div>
    </div >
  );
};
