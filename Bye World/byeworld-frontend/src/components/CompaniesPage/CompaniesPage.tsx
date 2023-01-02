import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Company } from "../../model/Company";
import CompaniesPageHeader from "../common/CompaniesPageHeader/CompaniesPageHeader";
import CompanyList from "../common/CompanyList/CompanyList";

const companyEx: Company = {
  id: 5,
  vat: "0",
  name: "Levi",
  address: "Belgrade",
  email: "email",
  reviewsCount: 5,
  listingsCount: 5,
  avgReview: 3.4,
  phone: "",
  description: "kkddks",
  logoUrl:
    "https://www.logodesign.net/logo/line-art-house-roof-and-buildings-4485ld.png",
  listings: [],
  reviews: [],
};

const Companies: React.FC = () => {
  const [searchField, setSearchField] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    console.log(searchField);
  }, [searchField]);

  return (
    <Box>
      <CompaniesPageHeader onChange={setSearchField} value={searchField} />
      <CompanyList companies={companies}></CompanyList>
    </Box>
  );
};

export default Companies;
