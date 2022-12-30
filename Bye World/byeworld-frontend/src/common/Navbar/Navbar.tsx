import { AppBar, Icon, IconButton, Toolbar } from "@mui/material";
import { Outlet, Search } from "react-router-dom";

export const Navbar: React.FC = () => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton>
            <Icon className="material-symbols-outlined" color="secondary">
              menu
            </Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Outlet></Outlet>
    </>
  );
};
