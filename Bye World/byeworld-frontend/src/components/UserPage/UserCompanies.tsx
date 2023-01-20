import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../hooks/api.hook";
import { Company } from "../../model/Company";
import CompanyCard from "../common/CompanyCard/CompanyCard";

const UserCompanies = () => {
  const params = useParams();

  const { loading, result: companies } = useApi<Company[]>(
    `company/user/${params.userId}`
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-20">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <Box>
        <Typography>User does not have any companies</Typography>
      </Box>
    );
  }

  return (
    <Box
      className="flex justify-center items-center w-4/5
 pt-10 flex-wrap gap-5"
    >
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </Box>
  );
};

export default UserCompanies;
