import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, Chip, Icon } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ListingDTO } from "../../listings/ListingsPage";
import parse from "html-react-parser";
import MatIcon from "../MatIcon/MatIcon";
import IconButton from "@mui/material/IconButton";
import { useAuthContext } from "../../../contexts/auth.context";

interface ListingCardProps {
  listing: ListingDTO;
  onFvToggle?: (Id: number) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onFvToggle = () => null,
}: ListingCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const handleFvClick = () => {
    if (!isAuthenticated()) {
      navigate("/signin");
    }
    onFvToggle(listing.id);
  };

  return (
    <Card className="w-full">
      <CardActionArea className="h-full" disableRipple={true}>
        <CardContent className="h-full">
          <div className="flex flex-row justify-between h-full">
            <div className="flex flex-col gap-4 px-4 md:pl-4 mb-4 w-2/3">
              <div className="grid gap-1">
                <div className="flex items-center gap-1 w-full overflow-hidden ">
                  <p
                    className="hover:opacity-50 font-bold text-lg"
                    onClick={() => navigate("/listing/" + listing.id)}
                  >
                    {listing!.title}
                  </p>
                  <IconButton
                    className="flex justify-center"
                    onClick={handleFvClick}
                  >
                    <MatIcon
                      style={{ color: "red", fontSize: "1.6rem" }}
                      variant={`${
                        listing.isFavorite ? "contained" : "outlined"
                      }`}
                    >
                      favorite
                    </MatIcon>
                  </IconButton>
                </div>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-1 w-1/2 overflow-hidden">
                  <p className="font-semibold opacity-75">
                    <a href={`/company/${listing.companyId}/about`}>
                      {listing.companyName}
                    </a>
                  </p>
                </div>
              </div>

              <div className="grid gap-1">
                <div
                  className="flex items-center gap-1 w-full overflow-hidden p-5"
                  style={{ boxShadow: "2px 10px #888888;" }}
                >
                  {/* <p className="text-sm opacity-90">{listing!.description}</p> */}
                  <div
                    style={{
                      maxHeight: "50px",
                      overflow: "hidden",
                    }}
                  >
                    {parse(listing!.description)}
                  </div>
                </div>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Icon className="material-symbols-outlined">
                      location_city
                    </Icon>
                    <p className="text-sm font-semibold">{listing.cityName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Icon className="material-symbols-outlined">schedule</Icon>
                  <p className="text-sm font-semibold">
                    {new Date(listing.closingDate).toLocaleDateString("de-DE")}
                  </p>
                </div>
              </div>
              {/*TODO: ?? Map required skills below and fix tag navigation */}
              <Box className="flex items-center gap-2 flex-wrap">
                {listing.requirements.map((r, i) => {
                  return <Chip key={i} label={r.name} color="primary" />;
                })}
              </Box>
            </div>
            <div className="w-1/5 flex flex-col justify-center align-middle">
              <img
                alt=""
                className="w-40 h-40"
                src={
                  listing.companyLogoUrl && listing.companyLogoUrl?.length >= 0
                    ? listing.companyLogoUrl
                    : "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png"
                }
                onClick={() => navigate(`/company/${listing.companyId}/about`)}
              />
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
