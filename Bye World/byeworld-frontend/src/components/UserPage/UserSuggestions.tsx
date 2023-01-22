import {
  Box,
  CircularProgress,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { SimilarListingCard } from "../ListingPage/SimilarListingCard";
import { ListingDTO } from "../listings/ListingsPage";
import { useApi } from "../../hooks/api.hook";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth.context";

const UserSuggestions = () => {
  const { isAuthenticated } = useAuthContext();

  const { result: suggestions, loading } = useApi<ListingDTO[]>(
    isAuthenticated() ? "listing/related" : ""
  );

  if (isAuthenticated() == false) {
    return <></>;
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-20">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return <></>;
  }

  return (
    <Box className="flex center py-5 justify-center">
      <Box className="xl:w-3/5 w-full">
        <Grid container columns={{ xs: 1, md: 3 }}>
          {suggestions.map((item) => {
            return (
              <Grid key={item.id} xs={1}>
                <Link to={`/listing/${item.id}`}>
                  <SimilarListingCard listing={item} divHeight={300} />
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default UserSuggestions;
