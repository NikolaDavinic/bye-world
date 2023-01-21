import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useApi } from "../../hooks/api.hook";
import { ListingsList } from "../common/ListingsList/ListingsList";
import { ListingDTO } from "../listings/ListingsPage";

const FavListings = () => {
  const params = useParams();

  const {
    result: listings,
    loading,
    setResult: setListings,
  } = useApi<ListingDTO[]>(`/listing/favorites/${params.userId}`, []);

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-20">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <Box>
        <Typography>No favorite listings yet</Typography>
        <Typography>
          To add listing as favorite, press heart icon in the top right corner
          of your favorite listings!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {listings && listings?.length > 0 && (
        <ListingsList listings={listings ?? []}></ListingsList>
      )}
    </Box>
  );
};

export default FavListings;
