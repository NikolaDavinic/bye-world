import { Box, CircularProgress } from "@mui/material";
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

  // const toggleFavoriteListing = (id: number) => {
  //   setListings((listings) => );
  // };

  return (
    <Box>
      <ListingsList listings={listings ?? []}></ListingsList>
    </Box>
  );
};

export default FavListings;
