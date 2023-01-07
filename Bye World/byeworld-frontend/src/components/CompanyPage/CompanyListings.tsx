import { useApi } from "../../hooks/api.hook";
import { ListingsList } from "../common/ListingsList/ListingsList";
import { CompanyContext } from "./CompanyPage";
import { useContext } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Listing } from "../../model/Listing";
import { useParams } from "react-router";

const CompanyListings = () => {
  const { companyId } = useParams();

  const {
    result: listings,
    loading,
    error,
  } = useApi<Listing[]>(`/company/listings/${companyId}`);

  if (loading) {
    return (
      <Box className="flex items-center justify-center">
        <CircularProgress className="mt-20" color="primary" />
      </Box>
    );
  }

  if (!listings) {
    return <></>;
  }

  return <ListingsList listings={listings}></ListingsList>;
};

export default CompanyListings;
