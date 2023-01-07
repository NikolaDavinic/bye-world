import React from "react";
import { Review } from "../../model/Review";
import ReviewForm from "./ReviewForm";

const AddReviewPage = () => {
  const onAddReview = (review: Review) => {};

  return (
    <div>
      <ReviewForm onSubmit={onAddReview}></ReviewForm>
    </div>
  );
};

export default AddReviewPage;
