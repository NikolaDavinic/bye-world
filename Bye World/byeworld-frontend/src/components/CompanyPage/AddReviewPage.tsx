import { Box } from "@mui/system";
import { api } from "../../constants";
import { Review } from "../../model/Review";
import { CompanyContext } from "./CompanyPage";
import ReviewForm from "./ReviewForm";
import { useContext } from "react";
import { useNavigate } from "react-router";

const AddReviewPage = () => {
  const company = useContext(CompanyContext);
  const navigate = useNavigate();

  const onAddReview = (review: Review) => {
    api
      .post<Review>("/review", {
        companyId: company.id,
        description: review.description,
        value: review.value,
      })
      .then(() => {
        console.log();
        navigate("../reviews");
      });
  };

  return (
    <Box className="flex justify-center p-10">
      <Box className="w-3/5">
        <ReviewForm onSubmit={onAddReview}></ReviewForm>
      </Box>
    </Box>
  );
};

export default AddReviewPage;
