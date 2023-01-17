import {
  Box,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Rating,
  Stack,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../constants";
import { useAuthContext } from "../../../contexts/auth.context";
import { Review } from "../../../model/Review";
import ReviewForm from "../../CompanyPage/ReviewForm";
import MatIcon from "../MatIcon/MatIcon";

interface ReviewCardProps {
  review: Review;
  displayCompany?: boolean;
  showOptions?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (review: Review) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  displayCompany = false,
  showOptions = true,
  onDelete = () => {},
  onUpdate = () => {},
}: ReviewCardProps) => {
  const { user, isAuthenticated } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper sx={{ textAlign: "left" }} className="p-3">
      {displayCompany && (
        <Box>
          <Link to={`/company/${review.company?.id}/reviews`}>
            <Typography fontWeight="500" color="gray">
              {review.company?.name}
            </Typography>
          </Link>
        </Box>
      )}
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
          {new Date(review.date ?? "").toLocaleDateString("en-GB")}
          {showOptions && (
            <Box>
              <IconButton onClick={handleClick}>
                <MatIcon style={{ color: "black" }}>more_vert</MatIcon>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
              >
                <MenuItem onClick={() => onDelete(review.id!)}>
                  <MatIcon color="warning">delete</MatIcon>
                  &nbsp;Delete
                </MenuItem>
                <MenuItem onClick={() => setIsEditing((prev) => !prev)}>
                  <MatIcon color="primary">edit</MatIcon>&nbsp;Edit
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
        {!isEditing && (
          <Box>
            <Box className="flex items-center gap-3">
              <Rating name="read-only" value={review?.value} readOnly />
              {`${review?.value} / 5`}
            </Box>
            <Box className="pl-1">{review?.description}</Box>
          </Box>
        )}
        {isEditing && (
          <Box>
            <ReviewForm
              review={review}
              buttonText="Save"
              onSubmit={(review) => {
                setIsEditing(false);
                onUpdate(review);
              }}
            ></ReviewForm>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
