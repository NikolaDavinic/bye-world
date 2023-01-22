import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Icon, Input } from "@mui/material";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import { useAuthContext } from "../../../contexts/auth.context";
import { styled, alpha } from "@mui/material/styles";
import MatIcon from "../MatIcon/MatIcon";
import TextField from "@mui/material/TextField";
import UsersSearch from "./UsersSearch";
import { ConfirmProvider } from "material-ui-confirm";

const pages = ["Listings", "Companies"];

export const Navbar = () => {
  const { isAuthenticated, signout, user } = useAuthContext();

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignout = () => {
    signout();
    navigate("/signin");
  };

  const handleSignIn = () => {
    handleCloseNavMenu();
    navigate("/signin");
  };

  return (
    <>
      <AppBar position="static" sx={{ maxHeight: "20vh" }} variant="elevation">
        <Container maxWidth="xl">
          <Toolbar disableGutters variant="dense" style={{ height: "36px" }}>
            <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 0 }}>
              <Link to="/">
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Icon className="material-symbols-outlined">code</Icon>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      mr: 2,
                      flexGrow: 1,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".3rem",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    BYEWORLD
                  </Typography>
                </Box>
              </Link>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <Icon className="material-symbols-outlined">menu</Icon>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">
                      <Link to={`/${page.toLowerCase()}`}>{page}</Link>
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
              <Link to="/">
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Icon className="material-symbols-outlined">code</Icon>
                  <Typography
                    variant="h5"
                    noWrap
                    sx={{
                      mr: 2,
                      flexGrow: 1,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".3rem",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    BYEWORLD
                  </Typography>
                </Box>
              </Link>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <NavLink
                  key={page}
                  to={`/${page.toLowerCase()}`}
                  style={({ isActive }) =>
                    isActive ? { textDecoration: "underline" } : undefined
                  }
                >
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                </NavLink>
              ))}
            </Box>
            <Box
              sx={{ display: "block", bgcolor: "white", mx: "10px" }}
              className="flex items-center justify-center"
            >
              <UsersSearch></UsersSearch>
            </Box>
            {!isAuthenticated() ? (
              <Box sx={{ display: "block" }}>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user?.name ?? "User Name"}
                      src={
                        user?.imageUrl && user?.imageUrl?.length > 0
                          ? user?.imageUrl.replace(
                              "background=311b92",
                              "background=fdd835"
                            )
                          : "https://ui-avatars.com/api/?background=311b92&color=fff&name=B+W&rounded=true"
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Link to={`/user/${user?.id}`}>
                      <Typography textAlign="center">Profile</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleSignout}>
                    <Typography sx={{ color: "orange" }}>Sign Out</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ minHeight: "80vh" }}>
        <ConfirmProvider>
          <Outlet />
        </ConfirmProvider>
      </Box>
      <Footer />
    </>
  );
};
