import { useApi } from "../../hooks/api.hook";
import { ListingsList } from "../common/ListingsList/ListingsList";
import { CompanyContext } from "./CompanyPage";
import { useContext } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Listing } from "../../model/Listing";

const CompanyListings = () => {
  const company = useContext(CompanyContext);

  const {
    result: listings,
    loading,
    error,
  } = useApi<Listing[]>(`/company/listings/${company.id}`);

  if (loading || listings === null) {
    return (
      <Box className="flex items-center justify-center">
        <CircularProgress className="mt-20" color="primary" />
      </Box>
    );
  }

  return <ListingsList listings={listings}></ListingsList>;
};

export default CompanyListings;
