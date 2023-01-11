import { Box, Button, Rating, TextField, Typography } from "@mui/material";
import React from "react";
import { Review } from "../../model/Review";

interface ReviewFormProps {
  buttonText?: string;
  onSubmit: (review: Review) => void;
  review?: Review;
}

const ReviewForm = ({
  review,
  buttonText = "Add Review",
  onSubmit,
}: ReviewFormProps) => {
  const [rating, setRating] = React.useState<number>(review?.value ?? 3);
  const [description, setDescription] = React.useState<string>(
    review?.description ?? ""
  );

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      id: review?.id,
      value: rating,
      description: description,
    });
  };

  console.log(rating);

  return (
    <Box
      component="form"
      className="flex items-center justify-center flex-col gap-1"
      onSubmit={handleSubmit}
    >
      <Box className="flex-column items-center justify-center">
        <Typography component="legend">
          Rate your experience with this company
        </Typography>
        <Box className="flex">
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue ?? 0);
            }}
          />
        </Box>
      </Box>
      <Box className="flex items-center justify-center flex-col gap-1 w-full">
        <TextField
          name="description"
          style={{ maxHeight: "400px", width: "100%" }}
          placeholder="Help other users by describing your experience"
          multiline
          size="medium"
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= 500)
              return setDescription(e.target.value);
          }}
          maxRows={10}
        />
        <Typography className="text-gray-400 mt-3">
          {description.length} / 500
        </Typography>
      </Box>
      <Button type="submit" variant="outlined" className="self-end">
        {buttonText}
      </Button>
    </Box>
  );
};

export default ReviewForm;
