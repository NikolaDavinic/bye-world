import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";


export const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    reValidateMode: "onSubmit",
  });

  const onSubmit = handleSubmit((creds) => {});

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
