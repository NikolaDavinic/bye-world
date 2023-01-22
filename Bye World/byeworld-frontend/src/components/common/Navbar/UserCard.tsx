import { Box, ListItem, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { User } from "../../../model/User";
import MatIcon from "../MatIcon/MatIcon";

interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/user/${user.id}`}>
      <Paper sx={{ p: "10px" }}>
        <Box className="flex items-center gap-1">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="user profile"
              height="50px"
              width="50px"
            ></img>
          ) : (
            <MatIcon style={{ fontSize: "2rem" }} color="primary">
              person
            </MatIcon>
          )}
          <Box>
            <Box sx={{ ml: "10px" }}>
              <Typography>{user.name}</Typography>
              <Typography color="gray">{user.email}</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Link>
  );
};

export default UserCard;
