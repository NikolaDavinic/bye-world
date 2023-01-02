import "./App.css";
import { ThemeProvider, createTheme, Box } from "@mui/material";
import { Route, Routes } from "react-router";
import { SignUp } from "./components/SignUp/Signup";
import { SignIn } from "./components/SignIn/Signin";
import { UserProvider } from "./contexts/user.context";
import { Listings } from "./components/Listings/Listings";
import { Navbar } from "./components/common/Navbar/Navbar";
import { Home } from "./components/Home/Home";
import NotFound from "./components/NotFound/NotFound";
import CompaniesPage from "./components/CompaniesPage/CompaniesPage";

const theme = createTheme({
  palette: {
    primary: {
      light: "#fbc02d",
      main: "#311b92",
      dark: "#000063",
    },
    secondary: {
      light: "#fbc02d",
      main: "#ffd54f",
      dark: "#000063",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Box className="App">
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route path="" element={<Home />}></Route>
              <Route path="/listings" element={<Listings />}></Route>
              <Route path="/companies" element={<CompaniesPage />}></Route>
              <Route path="*" element={<NotFound />}></Route>
            </Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Routes>
        </Box>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
