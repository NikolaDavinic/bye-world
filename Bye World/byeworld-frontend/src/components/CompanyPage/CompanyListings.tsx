import { useApi } from "../../hooks/api.hook";
import { ListingsList } from "../common/ListingsList/ListingsList";
import { Box, CircularProgress } from "@mui/material";
import { useParams } from "react-router";
import { ListingDTO } from "../listings/ListingsPage";

const CompanyListings = () => {
  const { companyId } = useParams();

  const {
    result: listings,
    loading,
    setResult: setListings,
  } = useApi<ListingDTO[]>(`/listing/company/${companyId}`);

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

  return (
    <ListingsList
      listings={listings}
      toggleFavorite={toggleFavoriteListing}
    ></ListingsList>
  );
};

export default CompanyListings;
