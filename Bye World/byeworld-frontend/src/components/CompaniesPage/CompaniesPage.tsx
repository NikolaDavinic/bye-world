import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Company } from "../../model/Company";
import CompaniesPageHeader from "./CompaniesPageHeader";
import axios from "axios";
import { api, constants } from "../../constants";
import { useDebounce } from "../../hooks/debounce.hook";
import CompanyCard from "../common/CompanyCard/CompanyCard";
import { Stack } from "@mui/material";

const Companies: React.FC = () => {
  const [searchField, setSearchField] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);

  const debouncedSearchField = useDebounce(searchField, 500);

  async function getFilteredCompanies(filter: string) {
    const response = await api.get("/company/filter", {
      params: {
        filter,
      },
    });
    setCompanies(response.data);
  }

  useEffect(() => {
    if (debouncedSearchField.length >= 3)
      getFilteredCompanies(debouncedSearchField);
  }, [debouncedSearchField]);

  return (
    <Stack justifyContent="center" alignItems="center">
      <Box className="w-full">
        <CompaniesPageHeader onChange={setSearchField} value={searchField} />
      </Box>
      <Box
        className="flex justify-center items-center w-4/5
       pt-10 flex-wrap gap-5"
      >
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </Box>
    </Stack>
  );
};

export default Companies;
