import {
  Box,
  CircularProgress,
  Link,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { SimilarListingCard } from "../ListingPage/SimilarListingCard";
import { ListingDTO } from "../listings/ListingsPage";
import { useApi } from "../../hooks/api.hook";
import Grid from "@mui/material/Grid";
import { ListingCard } from "../common/ListingsList/ListingCard";

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
    <Grid container sx={{ width: "100%" }}>
      {suggestions.map((item) => {
        return (
          <Grid item key={item.id}>
            <Link href={`/listing/${item.id}`}>
              {/* <SimilarListingCard listing={item} /> */}
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default UserSuggestions;
