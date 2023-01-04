import { Button, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useForm } from "react-hook-form";
import { Company } from "../../../model/Company";

interface AddCompanyProps {
  onSubmit: (data: Company) => void;
}

interface FormInputFields {
  name: string;
  description: string;
  email: string;
  vat: string;
  address: string;
}

const AddCompanyForm = ({ onSubmit }: AddCompanyProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputFields>({
    reValidateMode: "onSubmit",
  });

  const onSubmitForm = (data: FormInputFields) => {
    onSubmit({
      address: data.address,
      name: data.name,
      email: data.email,
      vat: data.vat,
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
          label="VAT number"
          {...register("vat", { required: true })}
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
          Add Company
        </Button>
      </Stack>
    </Box>
  );
};

export default AddCompanyForm;
