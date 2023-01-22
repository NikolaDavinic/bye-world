import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api, constants } from "../../constants";
import { Company } from "../../model/Company";
import AddCompanyForm from "../common/AddCompanyForm/AddCompanyForm";
import UpdateCompanyForm from "../common/UpdateCompanyForm/UpdateCompanyForm";

const UpdateCompanyPage = () => {
  const navigate = useNavigate();

  const onSubmit = async (company: Company) => {
    console.log(company);
    let com = {
      Name: company.name,
      Description: company.description,
      Email: company.email,
      VAT: company.vat,
      Address: company.address,
    };
    api
      .put(`/company/updatecompany`, com)
      .then(({ data }) => {
        navigate(`/company/${data.id}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <UpdateCompanyForm onSubmit={onSubmit} />
    </div>
  );
};

export default UpdateCompanyPage;
