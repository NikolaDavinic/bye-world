import axios from "axios";
import { useNavigate } from "react-router-dom";
import { constants } from "../../constants";
import { Company } from "../../model/Company";
import AddCompanyForm from "../common/AddCompanyForm/AddCompanyForm";

const AddCompanyPage = () => {
  const navigate = useNavigate();

  const onSubmit = async (company: Company) => {
    console.log(company);
    let com = {
      Name: company.name,
      Description: company.description,
      Email: company.email,
      VAT : company.vat,
      Address: company.address
    }
    await axios
      .post(constants.apiName + "/company", com, { withCredentials: true })
      .then(({ data }) => {
        navigate(`/company/${data.id}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <AddCompanyForm onSubmit={onSubmit} />
    </div>
  );
};

export default AddCompanyPage;
