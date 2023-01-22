import React from "react";
import { Box, Button, CircularProgress, Paper, Stack } from "@mui/material";
import { UserSkillsModal } from "../UserSkillsModal/UserSkillsModal";
import { useApi } from "../../hooks/api.hook";
import { User } from "../../model/User";
import { Link, Outlet, useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth.context";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import Upload from "../common/Upload/Upload";
import { upService } from "../../constants";
import Chip from "@mui/material/Chip";
import { getFileName } from "../../utils/helpers";
import MatIcon from "../common/MatIcon/MatIcon";
import UserSuggestions from "./UserSuggestions";

export default function UserPage() {
  const [open, setOpen] = React.useState(false);
  const params = useParams();

  const { user } = useAuthContext();

  const {
    result: userp,
    loading,
    error,
    reload,
  } = useApi<User>(`/user/${params.userId}`);

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-20">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex justify-center py-20">
        <Typography variant="h6" color="gray">
          {error}
        </Typography>
      </Box>
    );
  }

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  const onCvUpload = (file: File) => {
    const formData = new FormData();
    formData.append("cv", file);

    upService
      .post(`file/upload`, formData)
      .then(() => {
        window.location.reload();
      })
      .catch();
  };

  return (
    <Box>
      {user?.id == Number(params.userId) && (
        <Box>
          <UserSuggestions></UserSuggestions>
        </Box>
      )}
      <main>
        <UserSkillsModal isOpen={open} handleModalClose={handleModalClose} />

        <Box sx={{ bgcolor: "var(--secondary-main)", height: "150px" }}></Box>
        <div
          className="max-w-5xl mx-auto flex flex-col gap-8 px-4 -mt-12 mb-8
    w-full __section bg-gradient-to-r relative"
        >
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-wrap gap-4 items-center justify-between p-8">
              <div className="flex flex-wrap items-center gap-6">
                <Paper variant="outlined">
                  <img
                    alt="user"
                    src={
                      user?.imageUrl && user?.imageUrl?.length > 0
                        ? user?.imageUrl
                        : "https://ui-avatars.com/api/?background=311b92&color=fff&name=B+W&rounded=true"
                    }
                  />
                </Paper>
                <div className="space-y-1 md:space-y-0">
                  {userp?.id === user?.id && (
                    <Typography color="gray">
                      It's nice to see you back on ByeWorld!
                    </Typography>
                  )}
                  <p className="font-medium text-left">{userp?.name}</p>
                  <p className="opacity-60 font-medium">{userp?.email}</p>
                </div>
              </div>

              <Stack>
                <ListItem>
                  {user?.id == params.userId && (
                    <Button
                      variant="contained"
                      onClick={() => handleModalOpen()}
                      style={{ width: "100%" }}
                    >
                      Edit Skills
                    </Button>
                  )}
                </ListItem>
                {user?.id == params.userId && (
                  <ListItem>
                    <Upload onChange={onCvUpload} text="Upload CV"></Upload>
                  </ListItem>
                )}
                {userp?.cv &&
                  (user?.id === params.userId || user?.role === "Company") && (
                    <ListItem>
                      <a
                        rel="noreferrer"
                        href={userp.cv}
                        target="_blank"
                        download={getFileName(userp?.cv)}
                      >
                        <Chip
                          style={{ cursor: "pointer" }}
                          color="primary"
                          label={`${getFileName(userp?.cv)}`}
                          icon={<MatIcon color="primary">download</MatIcon>}
                          variant="outlined"
                        />
                      </a>
                    </ListItem>
                  )}
              </Stack>
            </div>

            <div
              className="grid grid-cols-3 md:divide-x 
            md:divide-gray-200 md:divide-solid border-t md:border-gray-200"
            >
              <Link
                to="fav-listings"
                className="flex flex-wrap items-center justify-center gap-2 p-4 font-medium bg-gray-100  
                hover:opacity-75"
              >
                <span className="text-sm hidden md:inline-block">
                  Favorite Listings
                </span>
                <i className="las la-heart text-2xl md:hidden"></i>
                <span
                  className="text-xs rounded-full w-6 h-6 flex items-center justify-center bg-black/60 text-white 
"
                >
                  {userp?.favListingsCount}
                </span>
              </Link>
              <Link
                to="companies"
                className="flex flex-wrap items-center justify-center gap-2 p-4 font-medium bg-gray-100  
                hover:opacity-75"
              >
                <span className="text-sm hidden md:inline-block">
                  Companies
                </span>
                <i className="las la-building text-2xl md:hidden"></i>
                <span
                  className="text-xs rounded-full w-6 h-6 flex items-center justify-center bg-black/60 text-white 
"
                >
                  {userp?.companiesCount}
                </span>
              </Link>
              <Link
                to="reviews"
                className="flex flex-wrap items-center justify-center gap-2 p-4 font-medium bg-gray-100  
        hover:opacity-75"
              >
                <span className="text-sm hidden md:inline-block">Reviews</span>
                <i className="las la-comments text-2xl md:hidden"></i>
                <span
                  className="text-xs rounded-full w-6 h-6 flex items-center justify-center bg-black/60 text-white 
"
                >
                  {userp?.reviewsCount}
                </span>
              </Link>
            </div>
          </div>
        </div>
        <Box>
          <Outlet />
        </Box>
      </main>
    </Box>
  );
}
