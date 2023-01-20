import React from "react";
import { useParams } from "react-router-dom";

const UserCompanies = () => {
  const params = useParams();
  console.log(params.userId);

  return <div>UserCompanies</div>;
};

export default UserCompanies;
