import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { useParams } from "react-router";
import { useApi } from "../../hooks/api.hook";
import { Review } from "../../model/Review";
import { ReviewCard } from "../common/ReviewCard/ReviewCard";

const review: Review = {
  description: "najbolja kompanija",
  company: {
    id: 1,
    name: "Microsoft",
  },
  user: {
    id: 2,
    name: "Stefan Stojadinovic",
  },
  value: 3,
  date: "18.23.11",
  id: 4,
};

const Reviews = () => {
  const { companyId } = useParams();

  const {
    result: reviews,
    loading,
    error,
  } = useApi<Review[]>(`/review/forcompany/${companyId}`);

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
          <ReviewCard key={r.id} review={r}></ReviewCard>
        ))}
      </Box>
    </Box>
  );
};

export default Reviews;
