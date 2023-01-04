import { useNavigate } from "react-router-dom";
import { Company } from "../../../model/Company";
import CompanyCard from "../CompanyCard/CompanyCard";
import { Link } from "@mui/material";

interface CompanyListProps {
  companies: Company[];
}

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
}: CompanyListProps) => {
  return (
    <>
      {companies.map((company) => (
        <Link href={`/company/${company.id}`}>
          <CompanyCard key={company.id} company={company} />
        </Link>
      ))}
    </>
  );
};

export default CompanyList;
