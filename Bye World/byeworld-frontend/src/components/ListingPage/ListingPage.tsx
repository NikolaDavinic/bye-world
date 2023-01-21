import { Button, Chip, Icon } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Listing } from "../../model/Listing";
import { ListingCard } from "../common/ListingsList/ListingCard";
import { SimilarListingCard } from "./SimilarListingCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../hooks/api.hook";
import axios from "axios";
import { ListingDTO } from "../listings/ListingsPage";
import { api } from "../../constants";
import { Company } from "../../model/Company";
import parse from "html-react-parser";
import { Skill } from "../../model/Skill";
import { SendCVModal } from "../SendCVModal/SendCVModal";
import IconButton from "@mui/material/IconButton/IconButton";
import MatIcon from "../common/MatIcon/MatIcon";
import Box from "@mui/material/Box/Box";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { useAuthContext } from "../../contexts/auth.context";

const ListingPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isAuthenticated } = useAuthContext();

  const { user } = useAuthContext();

  const {
    result: listing1,
    setResult: setListing,
    loading: listing1Loading,
  } = useApi<any>(`/listing/${params.id}`);

  const checkUserToken = () => {
    const userToken = localStorage.getItem("user");
    if (!userToken || userToken === "undefined") {
      setIsLoggedIn(false);
    }
    setIsLoggedIn(true);
  };

  const {
    result: listings,
    loading,
    error,
  } = useApi<ListingDTO[]>(`/listing/similarlistings/${params.id}`);

  useEffect(() => { }, []);

  const [open, setOpen] = React.useState(false);

  if (listing1Loading) {
    return (
      <Box className="flex items-center justify-center">
        <CircularProgress className="mt-20" color="primary" />
      </Box>
    );
  }

  const toggleFavorite = () => {
    if (!isAuthenticated()) {
      return navigate("/signin");
    }

    if (listing1) {
      setListing({ ...listing1, isFavorite: !listing1.isFavorite });

      api
        .put(`listing/favorite/${listing1.id}`)
        .then()
        .catch(() => {
          setListing({ ...listing1, isFavorite: !listing1.isFavorite });
        });
    }
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  const openGmail = () => {
    window.location.replace(`mailto:${listing1?.company.email}`)
  }

  return (
    <main className="flex-1">
      <div className="relative max-w-7xl mx-auto md:flex md:gap-6 px-4 py-8">
        <SendCVModal isOpen={open} handleModalClose={handleModalClose} />
        <div className="grid gap-4 w-full shadow-2xl shadow-indigo-500/50">
          <div className="print:shadow-none relative shadow-md rounded-lg mb-6 -mx-4 md:mx-auto md:w-full">
            <div className="print:bg-transparent print:text-black print:border-none top-0 relative bg-white rounded-t-lg border-b md:z-10">
              <div className="flex md:flex:row border-t-2 md:flex-wrap">
                <div className="flex-col grid gap-4 flex-1 pt-4 md:pt-8 md:pl-8 pl-4 md:mb-8 mb-4">
                  <div>
                    <h1>
                      <span className="font-bold text-xl">
                        {listing1?.title}
                      </span>

                      <IconButton
                        className="flex justify-center"
                        onClick={toggleFavorite}
                      >
                        <MatIcon
                          style={{ color: "red", fontSize: "1.6rem" }}
                          variant={`${listing1?.isFavorite ? "contained" : "outlined"
                            }`}
                        >
                          favorite
                        </MatIcon>
                      </IconButton>
                    </h1>
                    <h4>
                      <Link
                        to={`/company/${listing1?.company?.id}`}
                        className="print:text-black print:no-underline link font-semibold"
                      >
                        {listing1?.company?.name}
                      </Link>
                    </h4>
                  </div>
                  <div className="grid gap-1 pr-4 md:pr-0">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1">
                        <Icon className="material-symbols-outlined">
                          location_city
                        </Icon>
                        <p className="text-sm font-semibold">
                          {listing1?.city?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="print:hidden las la-clock text-lg leading-none"></i>
                      <p className="text-sm font-semibold flex items-center">
                        <Icon className="material-symbols-outlined">
                          schedule
                        </Icon>
                        {new Date(listing1?.closingDate).toLocaleDateString(
                          "de-DE"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {listing1?.skill != null &&
                      listing1?.skill?.map((r: any) => {
                        return (
                          <Chip key={r.id} label={r.name} color="primary" />
                        );
                      })}
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="flex flex-col justify-start ">
                      {listing1?.description && (
                        <div>{parse(listing1?.description)}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center align-center ">
                  <div className="print:mx-0 flex items-center justify-center md:mr-24 mt-4 md:mt-8 mb-4 mx-auto md:m-auto order-first md:order-last">
                    <Link to={`/company/${listing1?.company?.id}/about`} className="hover:opacity-75 bg-white p-2 rounded-md self-end">
                      <img
                        alt=""
                        className="w-40 h-40"
                        src={
                          listing1?.company?.logoUrl &&
                            listing1?.company?.logoUrl.length >= 0
                            ? listing1?.company?.logoUrl
                            : "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png"
                        }
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div
              className=" print:hidden sticky bottom-0 bg-white rounded-b-lg flex flex-col md:flex-row items-center justify-center  
                                    border-t p-4"
            >
              <div className="flex flex-col w-full md:w-auto gap-1">
                <p className="font-semibold text-red-600">
                  If you want to participate, all you have to do is to fill out
                  the form and send your CV.
                </p>
                {
                  
                    <Button variant="contained" onClick={openGmail}>
                      Apply Here
                    </Button>
                }
                {isLoggedIn && (
                  <p className="text-2xl text-red-800 font-semibold ">
                    To open form press button
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-200">
        <div className="grid gap-4 max-w-7xl mx-auto px-4 py-8">
          <p className="font-nold text-2xl text-start font-bold">
            Similar listings
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {listings != null &&
              listings?.map((listing) => {
                return (
                  <div key={listing?.id}>
                    <SimilarListingCard listing={listing} divHeight={300} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListingPage;
