import { Box, CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router";
import { api } from "../../constants";
import { useApi } from "../../hooks/api.hook";
import { Review } from "../../model/Review";
import { ReviewCard } from "../common/ReviewCard/ReviewCard";

const Reviews = () => {
  const { companyId } = useParams();
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const {
    result: reviews,
    loading,
    error,
    setResult: setReviews,
    setError,
  } = useApi<Review[]>(`/review/forcompany/${companyId}`);

  const onDeleteReview = (id: number) => {
    api
      .delete(`/review/${id}`)
      .then(() => {
        setReviews(reviews?.filter((review) => review.id !== id) ?? null);
      })
      .catch(() => {
        setError("Error occured whilst deleting review");
        setSnackBarOpen(true);
      });
  };

  const onUpdateReview = (review: Review) => {
    console.log(review);
    api
      .put<Review>("/review", review)
      .then(({ data }) => {
        setReviews(
          reviews?.map((r) => {
            if (r.id === data.id) {
              return {
                ...r,
                value: data.value,
                description: data.description,
              };
            }
            return r;
          }) ?? []
        );
      })
      .catch(() => {
        setError("Error occured whils updating review");
        setSnackBarOpen(true);
      });
  };

  console.log("rerender");

  if (loading) {
    return (
      <Box className="flex items-center justify-center">
        <CircularProgress className="mt-20" color="primary" />
      </Box>
    );
  }

  return (
    <Box className="w-full flex justify-center p-5">
      <Box className="w-full md:w-4/5 xl:w-4/6 flex flex-col gap-3">
        {reviews?.map((r) => (
          <ReviewCard
            key={r.id}
            review={r}
            onDelete={onDeleteReview}
            onUpdate={onUpdateReview}
          ></ReviewCard>
        ))}
      </Box>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackBarOpen(false)}
        message={error}
      />
    </Box>
  );
};

export default Reviews;
