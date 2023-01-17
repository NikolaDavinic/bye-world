import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useApi } from "../../hooks/api.hook";
import { Review } from "../../model/Review";
import { ReviewCard } from "../common/ReviewCard/ReviewCard";

const UserReviews = () => {
  const params = useParams();

  const { result: reviews, loading } = useApi<Review[]>(
    `review/user/${params.userId}`
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-20">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!reviews) {
    return <Box className="w-full text-center p-10">No reviews found</Box>;
  }

  return (
    <Box className="w-full flex justify-center">
      <Box className="w-full md:w-3/5 xl:w-3/6 flex flex-col gap-3">
        {reviews.map((r) => (
          <ReviewCard
            key={r.id}
            review={r}
            displayCompany={true}
            showOptions={false}
          ></ReviewCard>
        ))}
      </Box>
    </Box>
  );
};

export default UserReviews;
