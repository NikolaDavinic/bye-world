import { Box, CircularProgress, Link, Typography } from "@mui/material";
import React from "react";
import { useApi } from "../../hooks/api.hook";
import { SimilarListingCard } from "../ListingPage/SimilarListingCard";
import { ListingDTO } from "../listings/ListingsPage";

const UserSuggestions = () => {
  const { result: suggestions, loading } =
    useApi<ListingDTO[]>("listing/related");

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-20">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!suggestions) {
    return (
      <Box>
        <Typography>User does not have any companies</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {suggestions.map((item) => {
        return (
          <>
            <Link href={`/listing/${item.id}`} key={item.id}>
              <SimilarListingCard
                listing={item}
                divHeight={300}
                divMaxWidth={400}
                divMinWidth={350}
              />
            </Link>
          </>
        );
      })}
    </Box>
  );
};

export default UserSuggestions;
