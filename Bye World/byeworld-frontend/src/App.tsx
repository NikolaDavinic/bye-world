import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material";
import { Route, Routes } from "react-router";
import { SignUp } from "./components/SignUp/Signup";
import { SignIn } from "./components/SignIn/Signin";
import { Listings } from "./components/listings/ListingsPage";
import { Navbar } from "./components/common/Navbar/Navbar";
import { Home } from "./components/Home/Home";
import User from "./components/user/User";
import Companies from "./components/CompaniesPage/CompaniesPage";
import NotFound from "./components/NotFound/NotFound";
import AddCompanyPage from "./components/AddCompanyPage/AddCompanyPage";
import CompanyPage from "./components/CompanyPage/CompanyPage";
import Footer from "./components/common/Footer/Footer";
import { AuthStateProvider, useAuthContext } from "./contexts/auth.context";
import { useEffect } from "react";
import ListingPage from "./components/ListingPage/ListingPage";
import AboutCompany from "./components/CompanyPage/AboutCompany";
import CompanyListings from "./components/CompanyPage/CompanyListings";
import CompanyReviews from "./components/CompanyPage/CompanyReviews";
import AddReviewPage from "./components/CompanyPage/AddReviewPage";

const theme = createTheme({
  palette: {
    primary: {
      light: "#fbc02d",
      main: "#311b92",
      dark: "#000063",
    },
    secondary: {
      light: "#ffd54f",
      main: "#ffd54f",
      dark: "#c29fob",
    },
  },
});

function App() {
  const { autoLogin } = useAuthContext();

  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AuthStateProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route path="" element={<Home />}></Route>
              <Route path="/home" element={<Home />}></Route>
              <Route path="/listings" element={<Listings />}></Route>
              <Route path="/user/:id" element={<User />}></Route>
              <Route path="/companies" element={<Companies />}></Route>
              <Route path="/addcompany" element={<AddCompanyPage />}></Route>
              <Route path="/company/:companyId" element={<CompanyPage />}>
                <Route path="about" element={<AboutCompany />}></Route>
                <Route path="listings" element={<CompanyListings />}></Route>
                <Route path="reviews" element={<CompanyReviews />}></Route>
                <Route path="add-review" element={<AddReviewPage />}></Route>
              </Route>
              <Route path="/listing/:id" element={<ListingPage />}></Route>
              <Route path="*" element={<NotFound />}></Route>
              <Route path="/footer" element={<Footer />}></Route>
            </Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Routes>
        </div>
      </AuthStateProvider>
    </ThemeProvider>
  );
}

export default App;
