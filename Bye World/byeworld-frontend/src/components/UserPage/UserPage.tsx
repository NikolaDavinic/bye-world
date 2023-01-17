import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
// import Link from "@mui/material/Link";
import { UserSkillsModal } from "../UserSkillsModal/UserSkillsModal";
import { useApi } from "../../hooks/api.hook";
import { User } from "../../model/User";
import { Link, Outlet, useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth.context";
import Typography from "@mui/material/Typography";

export default function UserPage() {
  const [open, setOpen] = React.useState(false);
  const params = useParams();

  const { user } = useAuthContext();

  const {
    result: userp,
    loading,
    error,
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

  const onButtonSettings = () => {
    console.log("Clicked on button settings!");
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  return (
    <Box>
      <main>
        <UserSkillsModal isOpen={open} handleModalClose={handleModalClose} />

        <Box sx={{ bgcolor: "var(--secondary-main)", height: "150px" }}></Box>
        <div
          className="max-w-5xl mx-auto flex flex-col gap-8 px-4 -mt-12 mb-8
    w-full __section bg-gradient-to-r relative"
        >
          {/* <script src="https://www.helloworld.rs/public/js/plugins/pdfjs/build/pdf.js" type="text/javascript"></script> */}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-wrap gap-4 items-center justify-between p-8">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="bg-blue-800 text-white w-20 h-20 flex items-center justify-center text-center rounded-full text-lg font-semibold">
                    HW
                  </span>
                </div>
                <div className="space-y-1 md:space-y-0">
                  {userp?.id === user?.id && (
                    <Typography color="gray">
                      It's nice to see you back on ByeWorld!
                    </Typography>
                  )}
                  <p className="opacity-60 font-medium">{userp?.email}</p>
                </div>
              </div>

              <Button variant="outlined" onClick={() => handleModalOpen()}>
                Edit Skills
              </Button>
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
              <a
                href="/moj-nalog/kompanije"
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
              </a>
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
