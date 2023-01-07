import { Box, Paper, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { CompanyContext } from "./CompanyPage";

const AboutCompany = () => {
  const company = useContext(CompanyContext);

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-12">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-6 w-full">
            <Box className="flex flex-col gap bg-white rounded-md shadow-md p-8">
              <Typography textAlign="center" variant="h6">
                Contact
              </Typography>
              <Stack spacing={1}>
                <Paper className="p-2">
                  <Typography className="text-gray-400" variant="subtitle2">
                    ADDRESS
                  </Typography>
                  <Typography variant="body2">{company.address}</Typography>
                </Paper>
                <Paper className="p-2">
                  <Typography className="text-gray-400" variant="subtitle2">
                    VAT
                  </Typography>
                  <Typography variant="body2">{company.vat}</Typography>
                </Paper>
                <Paper className="p-2">
                  <Typography className="text-gray-400" variant="subtitle2">
                    EMAIL
                  </Typography>
                  <Typography variant="body2">{company.email}</Typography>
                </Paper>
              </Stack>
            </Box>
          </div>
          <div className="md:col-span-6">
            <Typography variant="h5">About Company</Typography>
            <Typography className="prose dark:prose-dark lg:prose-lg">
              {company.description}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCompany;
