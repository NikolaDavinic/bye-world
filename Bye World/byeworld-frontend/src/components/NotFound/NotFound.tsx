import { Box, Button, Grid, Link, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import React from "react";
import { useNavigate } from "react-router-dom";


const primary = blue[100];

const NotFound: React.FC = () => {

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: primary,
      }}
    >
      <Typography variant="h1" style={{ color: 'white' }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: 'white' }}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate(-1)}>Back Home</Button>
    </Box>
  );
};

export default NotFound;
