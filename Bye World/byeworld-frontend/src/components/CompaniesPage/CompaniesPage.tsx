import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Company } from "../../model/Company";
import CompaniesPageHeader from "./CompaniesPageHeader";
import CompanyList from "../common/CompanyList/CompanyList";
import axios from "axios";
import { constants } from "../../constants";

const companyEx: Company = {
  id: 5,
  vat: "0",
  name: "Levi",
  address: "Belgrade",
  email: "email",
  reviewsCount: 5,
  listingsCount: 5,
  avgReview: 3.4,
  description: "kkddks",
  logoUrl:
    "https://www.logodesign.net/logo/line-art-house-roof-and-buildings-4485ld.png",
  listings: [],
  reviews: [],
};

const Companies: React.FC = () => {
  const [searchField, setSearchField] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);

  async function getFilteredCompanies(filter: string) {
    const response = await axios.get(constants.apiName + "/company/filter", {
      params: {
        filter,
      },
    });
    setCompanies(response.data);
  }

  useEffect(() => {
    if (searchField.length >= 3) getFilteredCompanies(searchField);
  }, [searchField]);

  return (
    <Box>
      <CompaniesPageHeader onChange={setSearchField} value={searchField} />
      <Box className="flex justify-center items-center w-full pt-10 flex-wrap gap-5">
        <CompanyList companies={companies} />
      </Box>
    </Box>
  );
};

export default Companies;
