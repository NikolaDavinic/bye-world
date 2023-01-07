import {
  Box,
  Button,
  Rating,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Review } from "../../model/Review";

interface ReviewFormProps {
  buttonText?: string;
  onSubmit: (review: Review) => void;
}

const ReviewForm = ({
  buttonText = "Add Review",
  onSubmit,
}: ReviewFormProps) => {
  const [rating, setRating] = React.useState<number>(3);
  const [description, setDescription] = React.useState<string>("");

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      value: rating,
      description: description,
    });
  };

  return (
    <Box
      component="form"
      className="flex items-center justify-center flex-col gap-1"
      onSubmit={handleSubmit}
    >
      <Box>
        <Typography component="legend">
          Rate your experience with this company
        </Typography>
        <Rating
          name="rating"
          onChange={(event, newValue) => {
            setRating(newValue ?? 0);
          }}
        />
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
