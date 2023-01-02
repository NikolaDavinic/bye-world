import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

interface FormInputs {
  name: string;
  password: string;
  email: string;
  phone: string;
  repeatPassword: string;
}

export const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormInputs>({
    reValidateMode: "onChange",
  });

  const onSubmit = (data: FormInputs) => {
    console.log(data);
    let exampleUser = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password
    }
    axios.get("https://localhost:7294/Listing/5")
    .then((response) => {
      console.log(response);
      const myData = response.data;
      console.log(myData);
    });
    // let result = axios.post("http://localhost:7474/signup", exampleUser)
    // .then(response => {
    //   console.log(response)
    // })
    // .catch(error => {
    //   console.error(error)
    // })   
  };

  const repeatPasswordValidator = useCallback(
    (value: string) => getValues("password") === value,
    [getValues]
  );

  return (
    <Box
      sx={{
        height: "100%",
        p: "1em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          gap: "0.6em",
          width: { xs: "100%", sm: "80%" },
          maxWidth: "600px",
        }}
      >
        <TextField
          label="Name"
          className="form-field"
          error={Boolean(errors.name)}
          helperText={errors.name && "Name field is required"}
          {...register("name", { required: true })}
        ></TextField>
        <TextField
          label="Email"
          type="email"
          className="form-field"
          error={Boolean(errors.email)}
          helperText={errors.email && "Email is required"}
          {...register("email", { required: true })}
        ></TextField>
        <TextField
          label="Phone number"
          className="form-field"
          error={Boolean(errors.phone)}
          {...register("phone", { required: false })}
        ></TextField>
        <TextField
          label="Password"
          type="password"
          className="form-field"
          error={Boolean(errors.password)}
          helperText={errors.password && "Password is required"}
          {...register("password", { required: true })}
        ></TextField>
        <TextField
          label="Repeat password"
          type="password"
          className="form-field"
          {...register("repeatPassword", {
            required: true,
            validate: repeatPasswordValidator,
          })}
          error={Boolean(errors.repeatPassword)}
          helperText={errors.repeatPassword && "Passwords don't match"}
        ></TextField>
        <p>{}</p>
        <Button type="submit" variant="contained" color="primary">
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Box>
            Already have an account? <Link to="/signin">Sign In</Link>
          </Box>
        </Grid>
      </Stack>
    </Box>
  );
};
