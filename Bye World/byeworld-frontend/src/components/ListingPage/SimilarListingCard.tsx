import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, Chip, Icon } from "@mui/material";
import { Company } from "../../model/Company";
import { Listing } from "../../model/Listing";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/api.hook";
import parse from 'html-react-parser';
import { ListingDTO } from "../listings/ListingsPage";

interface SimilarListingCardProps {
  listing: ListingDTO;
  // divWidth: number;
  divHeight: number;
  divMaxWidth: number;
  divMinWidth: number;
}
export const SimilarListingCard: React.FC<SimilarListingCardProps> = ({
  listing, divHeight, divMaxWidth, divMinWidth
}: SimilarListingCardProps) => {
  const navigate = useNavigate();

  const {
    result: listing1,
  } = useApi<any>(`/listing/${listing?.id}`);

  return (
    <Card sx={{ maxWidth: divMaxWidth, width: "auto", minWidth: divMinWidth, height: divHeight }}>
      <CardActionArea
        className="h-full hover:bg-blue-100"
        onClick={() => navigate("/listing/" + listing.id)}
      >
        <CardContent className="h-full">
          <div className="flex flex-row justify-between h-full">
            <div className="flex flex-col gap-3 px-4 md:pl-4 mb-4 w-2/3">
              <div className="grid gap-1 box-content">
                <div className="flex items-center gap-1 w-1/2 overflow-hidden ">
                  <p className="hover:opacity-50 font-bold text-lg ">
                    {listing?.title != null && listing!.title}
                  </p>
                </div>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-1 w-1/2 overflow-hidden">
                  <p className="font-semibold opacity-75">
                      {/* Naziv komapnije */}
                      {listing.companyName!=null && listing?.companyName}
                  </p>
                </div>
              </div>

              <div className="grid gap-1">
                <div className="flex items-center gap-1 w-1/2 overflow-hidden">
                  {/* <p className="text-sm opacity-90">{listing1?.description && <div>{parse(listing1?.description)}</div>}</p> */}
                </div>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Icon className="material-symbols-outlined">
                      location_city
                    </Icon>
                    {/* <p className="text-sm font-semibold">{listing?.city != null && listing.city?.name}</p> */}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Icon className="material-symbols-outlined">schedule</Icon>
                  <p className="text-sm font-semibold">
                    {listing?.closingDate != null && new Date(listing.closingDate).toLocaleDateString("de-DE")}
                  </p>
                </div>
              </div>
              {/* TODO: Replace with Material UI chip */}
              {/*TODO: Map required skills below and fix tag navigation */}
              <Box className="flex items-center gap-2 flex-wrap">
                {/* <a href="/oglasi-za-posao/crm" className="bg-main text-white rounded-md btn btn-xs btn-primary w-auto">
                                    Java
                                </a>
                                <button type="button" className="w-auto bg-main text-white rounded-md cursor-pointer" >
                                    <span className='text-white'>Senior </span>
                                </button> */}
                {listing?.requirements!=null && listing?.requirements?.map((r:any) => {
                  return <Chip key={r.id} label={r.name} color="primary" />;
                })}
              </Box>
            </div>
            {/* <div className="w-1/5 flex flex-col justify-center align-middle">
              <img
                alt=""
                className="w-40 h-40"
                src={
                  listing.companyLogoUrl ??
                  "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png"
                }
                onClick={() => navigate("/company/" + listing.company)}
              />
            </div> */}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
