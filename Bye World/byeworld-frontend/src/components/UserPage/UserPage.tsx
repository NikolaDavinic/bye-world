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

  const { result: userp, loading, error } = useApi<User>(`/user/${params.id}`);

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

  console.log(userp, params.id, user?.id);

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
    <main className="flex-1">
      <UserSkillsModal isOpen={open} handleModalClose={handleModalClose} />

      <Box sx={{ bgcolor: "var(--secondary-main)" }}>
        <div className="hidden md:flex justify-end absolute right-0 inset-y-0 opacity-10">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 99 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-auto"
          >
            <path d="M47 0H23L0 36H24L47 0Z" fill="white"></path>
            <path
              d="M99 0H75L63.5 18L75 36H99L87.5 18L99 0Z"
              fill="url(#paint0_linear_34:129)"
            ></path>
            <path
              d="M54.75 9L49 18L54.75 27H60.75L55 18L60.75 9H54.75Z"
              fill="#00EA49"
            ></path>
            <path
              d="M29.503 18L23.753 27L29.503 36H35.503L29.753 27L35.503 18H29.503Z"
              fill="#00EA49"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_34:129"
                x1="140.482"
                y1="70.6211"
                x2="79.1462"
                y2="-12.7783"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#00EA49"></stop>
                <stop offset="0.49" stop-color="#00EA49"></stop>
                <stop offset="1" stop-color="#00FFD9"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-8 pb-16 w-full">
          <div
            className="flex items-center gap-1 overflow-auto pb-4 scrollbar-thin 
                scrollbar-thumb-white scrollbar-track-transparent scrollbar-thumb-rounded-full 
                scrollbar-track-rounded-full"
          >
            <Button variant="outlined" onClick={() => handleModalOpen()}>
              Edit Skills
            </Button>
            <a
              href="/moj-nalog/prijave"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="prijave"
            >
              Moje prijave
            </a>
            <a
              href="/moj-nalog/sacuvani-oglasi"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="sacuvani-oglasi"
            >
              Favorite Listings
            </a>
            <a
              href="/moj-nalog/kompanije"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="kompanije"
            >
              Kompanije
            </a>
            <a
              href="/moj-nalog/moja-iskustva"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="recenzije"
            >
              Moja iskustva
            </a>
            <a
              href="/moj-nalog/dokumenti"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="dokumenti"
            >
              Moji dokumenti
            </a>
            <a
              href="/moj-nalog/mejling-liste"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="mejling-liste"
            >
              Mejling liste
            </a>
            <a
              href="/moj-nalog/alttab"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="alttab"
            >
              altTab
            </a>
            <a
              href="/moj-nalog/podesavanja"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="podesavanja"
            >
              Podešavanja
            </a>

            <script type="text/javascript">
              {/* var userNavigationActiveclassName = 'bg-white  text-blue-800 dark:text-white dark:hover:opacity-100'; */}
              {/* var userNavigationInactiveclassName = 'text-white hover:bg-white hover:text-blue-800 dark:hover:text-white'; */}
            </script>
          </div>{" "}
        </div>
      </Box>
      <div
        className="relative max-w-5xl mx-auto flex flex-col gap-8 px-4 -mt-12 mb-8
    w-full __section bg-gradient-to-r from-green-500 to-blue-900 relative"
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

            <a href="/moj-nalog/podesavanja" className="btn btn-outline btn-md">
              <Button className="text outlined">Podešavanja</Button>
            </a>
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
              <span className="text-sm hidden md:inline-block">Companies</span>
              <i className="las la-building text-2xl md:hidden"></i>
              <span
                className="text-xs rounded-full w-6 h-6 flex items-center justify-center bg-black/60 text-white 
"
              >
                {userp?.companiesCount}
              </span>
            </a>
            <a
              href="/moj-nalog/chat"
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
            </a>
          </div>
        </div>
      </div>
      <Box>
        <Outlet />
      </Box>
    </main>
  );
}
