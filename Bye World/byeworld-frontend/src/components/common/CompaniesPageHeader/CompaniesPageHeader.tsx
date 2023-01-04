import { Box, Link, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { constants } from "../../../constants";
import CompanyCard from "../CompanyCard/CompanyCard";
import CompanyList from "../CompanyList/CompanyList";

interface CompaniesPageHeaderProps {
  value: string;
  onChange: (val: string) => void;
}

const CompaniesPageHeader: React.FC<CompaniesPageHeaderProps> = ({
  value,
  onChange,
}: CompaniesPageHeaderProps) => {
  const [filter, setFilter] = useState("");
  const [companies, setCompanies] = useState([]);

  async function getCompanies() {
    const response = await axios.get(
      constants.apiName + "/company/getallcompanies"
    );
    console.log(response.data);
    setCompanies(await response.data);
  }

  async function getFilteredCompanies() {
    const response = await axios.get(constants.apiName + "/company/filter", {
      params: {
        filter,
      },
    });
    console.log(response.data);
    setCompanies(await response.data);
  }

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    getFilteredCompanies();
  }, [filter]);

  return (
    <>
      <Box className="relative flex justify-center">
        <Box className="bg-gray-100" minHeight="200px" minWidth="100%"></Box>
        <Box
          textAlign="left"
          className="w-full md:w-4/5 xl:w-4/6 px-10"
          position="absolute"
        >
          <Box className="pt-10" minHeight="200px">
            <Typography variant="h5">Company profiles</Typography>
            <Typography textAlign="left" color="gray">
              Search companies by name or city
            </Typography>
          </Box>
          <Box className="relative w-full items-center justify-center flex">
            <TextField
              onChange={(e) => setFilter(e.target.value)}
              label="Name"
              color="primary"
              className="w-full absolute bg-gray-100"
              sx={{ top: "-1.9rem" }}
            ></TextField>
          </Box>
        </Box>
      </Box>
      <Box className="flex justify-center items-center w-full pt-10 flex-wrap gap-5">
        <CompanyList companies={companies} />
      </Box>
    </>
  );
};

export default CompaniesPageHeader;
