import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { Link } from "react-router-dom";
import { constants } from "../../constants";
import { useAuthContext } from "../../contexts/auth.context";
import CompanyCard from "../common/CompanyCard/CompanyCard";

interface CompaniesPageHeaderProps {
  value: string;
  onChange: (val: string) => void;
}

const CompaniesPageHeader: React.FC<CompaniesPageHeaderProps> = ({
  value,
  onChange,
}: CompaniesPageHeaderProps) => {
  const { user, userIsCompany } = useAuthContext();

  return (
    <>
      <Box className="relative flex justify-center">
        <Box className="bg-gray-100" minHeight="200px" minWidth="100%"></Box>
        <Box
          textAlign="left"
          className="w-full md:w-4/5 xl:w-4/6 px-10"
          position="absolute"
        >
          <Box
            className="pt-10 flex items-start justify-between"
            minHeight="200px"
          >
            <Box>
              <Typography variant="h5">Company profiles</Typography>
              <Typography textAlign="left" color="gray">
                Search companies by name or city
              </Typography>
            </Box>
            {userIsCompany() && (
              <Box>
                <Link to="/addcompany">
                  <Button variant="outlined">ADD COMPANY</Button>
                </Link>
              </Box>
            )}
          </Box>
          <Box className="relative w-full items-center justify-center flex">
            <TextField
              label="Name"
              color="primary"
              className="w-full absolute bg-gray-100"
              sx={{ top: "-1.9rem" }}
              onChange={(e) => onChange(e.target.value)}
            ></TextField>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CompaniesPageHeader;
