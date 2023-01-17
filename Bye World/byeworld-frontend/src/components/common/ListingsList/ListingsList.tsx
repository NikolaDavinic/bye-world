import { Box, Button, CircularProgress, Icon, TextField } from "@mui/material";
import React, { useState } from "react";
import { api } from "../../../constants";
import { Listing } from "../../../model/Listing";
import { ListingDTO } from "../../listings/ListingsPage";
import { ListingCard } from "./ListingCard";

interface ListingsListProps {
  listings: ListingDTO[];
  toggleFavorite?: (id: number) => void;
}

export const ListingsList: React.FC<ListingsListProps> = ({
  listings,
  toggleFavorite = () => null,
}) => {
  const handleFavoriteToggle = (Id: number) => {
    toggleFavorite(Id);

    api
      .put(`listing/favorite/${Id}`)
      .then()
      .catch(() => {});
  };

  return (
    <Box className="w-full justify-center flex">
      <div className="h-full px-4 py-4 space-y-4 bg-gray-100 w-full md:w-4/5 lg:w-3/5 flex justify-center">
        <div className="flex flex-col gap-4 items-center w-full">
          {/* <div className='flex flex-row gap-5'>
                        <Button variant="contained">Newest</Button>
                        <Button variant="outlined">Expiring soon</Button>
                    </div> */}
          {/* {listings.length === 0 && (
            <CircularProgress className="" color="primary" />
          )} */}
          {listings.map((l, i) => (
            <ListingCard
              key={i}
              listing={l}
              onFvToggle={handleFavoriteToggle}
            />
          ))}
          {/* <ListingCard listing={testListing} />
                    <ListingCard listing={testListing} />
                    <ListingCard listing={testListing} /> */}
        </div>
      </div>
    </Box>
  );
};
