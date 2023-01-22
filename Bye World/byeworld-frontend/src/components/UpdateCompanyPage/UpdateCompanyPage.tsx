import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { api, constants } from "../../constants";
import { useApi } from "../../hooks/api.hook";
import { Company } from "../../model/Company";
import AddCompanyForm from "../common/AddCompanyForm/AddCompanyForm";
import UpdateCompanyForm from "../common/UpdateCompanyForm/UpdateCompanyForm";

const UpdateCompanyPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { result, loading } = useApi<Company>(`/company/${params.id}`);

  const onSubmit = async (company: Company) => {
    let com = {
      id: result?.id,
      name: company.name,
      description: company.description,
      email: company.email,
      address: company.address,
    };
    console.log(com);
    api
      .put(`/company`, com)
      .then(({ data }) => {
        navigate(`/company/${data.id}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center">
        <CircularProgress className="mt-20" color="primary" />
      </Box>
    );
  }

  if (!result) {
    return <></>;
  }

  return (
    <div>
      <UpdateCompanyForm onSubmit={onSubmit} company={result} />
    </div>
  );
};

export default UpdateCompanyPage;
