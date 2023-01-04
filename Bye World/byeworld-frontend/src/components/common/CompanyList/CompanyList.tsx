import { useNavigate } from "react-router-dom";
import { Company } from "../../../model/Company";
import CompanyCard from "../CompanyCard/CompanyCard";

interface CompanyListProps {
  companies: Company[];
}

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
}: CompanyListProps) => {
  return (
    <>
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </>
  );
};

export default CompanyList;
