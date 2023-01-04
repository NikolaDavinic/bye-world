import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { constants } from "../../constants";
import { User } from "../../model/User";

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    reValidateMode: "onSubmit",
  });

  const onSubmit = handleSubmit((creds) => {
    axios
      .post<User>(`${constants.apiName}/user/signin`, creds)
      .then((res) => {
        console.log(res.data);
        navigate("/home");
      })
      .catch((err) => {});
  });

  return (
    <Box
      sx={{
        height: "100vh",
        p: "1em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: "flex",
          gap: "0.8em",
          width: { xs: "100%", sm: "80%" },
          maxWidth: "600px",
        }}
      >
        <TextField
          label="Email"
          className="form-field"
          type="email"
          {...register("email", { required: true })}
          error={Boolean(errors.email)}
        ></TextField>
        <TextField
          label="Password"
          className="form-field"
          type="password"
          {...register("password", { required: true })}
          error={Boolean(errors.password)}
        ></TextField>
        <Button variant="contained" sx={{ p: 1.2 }} type="submit">
          Sign In
        </Button>
        <Grid container justifyContent="flex-end">
          <Box>
            Don't have an account? <Link to="/signup"> Sign Up</Link>
          </Box>
        </Grid>
      </Stack>
    </Box>
  );
};
