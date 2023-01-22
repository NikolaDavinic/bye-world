import { Button, CircularProgress, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useForm } from "react-hook-form";
import { Company } from "../../../model/Company";
import { useApi } from "../../../hooks/api.hook";
import { useParams } from "react-router-dom";

interface UpdateCompanyProps {
  company: Company;
  onSubmit: (data: Company) => void;
}

interface FormInputFields {
  name: string;
  description: string;
  email: string;
  address: string;
}

const UpdateCompanyForm = ({ onSubmit, company }: UpdateCompanyProps) => {
  const params = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormInputFields>({
    reValidateMode: "onSubmit",
    values: {
      address: company.address ?? "",
      description: company.description ?? "",
      email: company.email ?? "",
      name: company.name ?? "",
    },
  });

  const onSubmitForm = (data: FormInputFields) => {
    onSubmit({
      address: data.address,
      name: data.name,
      email: data.email,
      description: data.description,
    });
  };

  return (
    <Box
      sx={{
        height: "100%",
        p: "1em",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmitForm)}
        sx={{
          display: "flex",
          gap: "0.8em",
          width: { xs: "100%", sm: "80%" },
          maxWidth: "600px",
        }}
      >
        <TextField
          label="Company name"
          {...register("name", { required: true })}
        ></TextField>
        <TextField
          type="email"
          label="Email"
          {...register("email", { required: true })}
        ></TextField>
        <TextField
          label="About company"
          multiline
          size="medium"
          {...register("description", { required: true })}
        ></TextField>
        <TextField
          label="Adress"
          {...register("address", { required: true })}
        ></TextField>
        <Button
          color="primary"
          type="submit"
          sx={{ width: "fit-content" }}
          variant="outlined"
        >
          Update Company
        </Button>
      </Stack>
    </Box>
  );
};

export default UpdateCompanyForm;
