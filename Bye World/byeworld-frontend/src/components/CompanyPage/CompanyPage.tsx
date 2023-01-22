import { TabPanel } from "@mui/joy";
import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { border } from "@mui/system";
import { ConfirmProvider, useConfirm } from "material-ui-confirm";
import React, { createContext, useEffect, useState } from "react";
import {
  Navigate,
  NavLink,
  Outlet,
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { api } from "../../constants";
import { useAuthContext } from "../../contexts/auth.context";
import { useApi } from "../../hooks/api.hook";
import { Company } from "../../model/Company";
import MatIcon from "../common/MatIcon/MatIcon";

const exCompany: Company = {
  id: 1,
  name: "Microsoft",
  email: "microsoft@email.com",
  address:
    "3097 Satellite Blvd Duluth, Džordžija 30096 Sjedinjene Američke Države",
  vat: "6652",
  description:
    "Microsoft is the largest vendor of computer software in the world." +
    "It is also a leading provider of cloud computing services, video games," +
    "computer and gaming hardware, search and other online services. Microsoft's" +
    "corporate headquarters is located in Redmond, Wash., and it has offices in more than 60 countries.",
  logoUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAO2OVFahr5diBUvB6aFTOJvlsqCbT1Yu1TSG_RNg&s",
  avgReview: 4.8,
};

export const CompanyContext = createContext<Company>({} as Company);

const CompanyPage = () => {
  const { isAuthenticated, user } = useAuthContext();
  const params = useParams();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const {
    result: company,
    loading,
    error,
  } = useApi<Company>(`/company/${params.companyId}`);

  if (!company) {
    if (loading) {
      return (
        <Box className="flex items-center justify-center">
          <CircularProgress className="mt-20" color="primary" />
        </Box>
      );
    } else {
      return <></>;
    }
  }

  const deleteCompany = () => {
    confirm({
      content: "Are you sure you want to delete this company?",
      title: "Confirm Action",
    }).then(() => {
      api.delete(`company/${company?.id}`).then(() => navigate("/companies"));
    });
  };

  const updateCompany = () => {};

  return (
    <>
      <Box className="bg-gray-100">
        <Box className="max-w-5xl mx-auto px-4 pt-16 pb-4 md:pb-8 relative">
          <Box className="flex flex-col gap-4 w-full">
            <Box className="w-full flex justify-between">
              <Box
                className="bg-white p-3 rounded shadow-xl"
                width="160px"
                height="160px"
              >
                <img
                  style={{ objectFit: company.logoUrl ? "cover" : "contain" }}
                  src={
                    company.logoUrl
                      ? company.logoUrl
                      : "/company-logo-placeholder.jpg"
                  }
                  alt={`${company.name} logo`}
                />
              </Box>
              {user?.id === company.userId && (
                <Box>
                  <Link to={`/updatecompany/${company.id}`}>
                    <Button sx={{ m: 0, p: 0 }} onClick={() => updateCompany()}>
                      <MatIcon style={{ fontSize: "2rem" }} color="primary">
                        edit
                      </MatIcon>
                    </Button>
                  </Link>
                  <Button sx={{ m: 0, p: 0 }} onClick={() => deleteCompany()}>
                    <MatIcon style={{ fontSize: "2rem", color: "red" }}>
                      delete
                    </MatIcon>
                  </Button>
                </Box>
              )}
            </Box>

            <Box
              className="flex flex-col md:flex-row items-start justify-between gap-4 w-full shadow-lg p-3 rounded-2xl"
              sx={{ border: "1px solid black" }}
            >
              <Box className="space-y-2 w-full">
                <Typography variant="h5" textAlign="left">
                  {company.name}
                </Typography>

                <Box>
                  <Box className="space-y-2">
                    <Box className="flex items-center gap-2">
                      <Chip
                        color="primary"
                        label={company?.avgReview ?? "/"}
                        variant="outlined"
                        icon={
                          <Icon
                            style={{
                              color: `${
                                company.avgReview
                                  ? "RGB(246,190,0)"
                                  : "RGB(70, 70, 70)"
                              }`,
                            }}
                            className="material-symbols-outlined"
                          >
                            stars
                          </Icon>
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>

              <div className="flex items-center justify-start md:justify-end gap-4 w-full md:mt-1">
                <Link to="add-review">
                  <Button color="secondary" variant="contained">
                    LEAVE REVIEW
                  </Button>
                </Link>

                <Box className="flex justify-end items-center">
                  {company.reviewsCount ?? 0}
                  <Tooltip title="Number of reviews">
                    <IconButton>
                      <Icon className="material-symbols-outlined">reviews</Icon>
                    </IconButton>
                  </Tooltip>
                </Box>
              </div>
            </Box>
          </Box>
        </Box>
      </Box>
      <AppBar
        position="static"
        sx={{ height: "50px", bgcolor: "white", display: "flex" }}
        className="flex justify-center items-center"
      >
        <Box className="flex gap-5">
          <NavLink to="about">
            <Button>About</Button>
          </NavLink>
          <NavLink to="listings">
            <Button>Listings</Button>
          </NavLink>
          <NavLink to="reviews">
            <Button>Reviews</Button>
          </NavLink>
        </Box>
      </AppBar>

      <CompanyContext.Provider value={company}>
        <Outlet />
      </CompanyContext.Provider>
    </>
  );
};

export default CompanyPage;
