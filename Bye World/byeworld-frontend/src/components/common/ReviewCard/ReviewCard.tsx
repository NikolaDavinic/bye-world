import { Box, Icon, Paper, Rating, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { Review } from "../../../model/Review";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
}: ReviewCardProps) => {
  return (
    <Paper sx={{ textAlign: "left" }} className="p-3">
      <Stack className="flex flex-col gap-3">
        <Box className="flex justify-between">
          <Box className="flex items-center gap-2">
            {review.user?.imageUrl ? (
              <img src={review.user.imageUrl} alt="user profile"></img>
            ) : (
              <Icon
                className="material-symbols-outlined"
                sx={{ fontSize: "2rem" }}
                color="primary"
              >
                person
              </Icon>
            )}
            <Link to={`/user/${review.user?.id}`}>
              {review.user?.name ?? ""}
            </Link>
          </Box>
          <Box>{new Date(review.date ?? "").toLocaleDateString("en-GB")}</Box>
        </Box>
        <Box className="flex items-center gap-3">
          <Rating name="read-only" value={review?.value} readOnly />
          {`${review?.value} / 5`}
        </Box>
        <Box className="pl-1">{review?.description}</Box>
      </Stack>
    </Paper>
  );
};
