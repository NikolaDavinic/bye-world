import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material";
import { Navigate, Route, Routes } from "react-router";
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
import { useEffect, useState } from "react";
import ListingPage from "./components/ListingPage/ListingPage";
import AboutCompany from "./components/CompanyPage/AboutCompany";
import CompanyListings from "./components/CompanyPage/CompanyListings";
import CompanyReviews from "./components/CompanyPage/CompanyReviews";
import AddReviewPage from "./components/CompanyPage/AddReviewPage";
import AuthenticatedGuard from "./components/common/RouteGuards/AuthenticatedGuard";

const theme = createTheme({
  palette: {
    primary: {
      light: "#fbc02d",
      main: "#311b92",
      dark: "#000063",
    },
    secondary: {
      light: "#ffd54f",
      main: "#7C921B",
      dark: "#c29fob",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthStateProvider>
        <div className="App">
          {/* <BrowserRouter> */}
          {/* <GuardProvider > */}
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route path="" element={<Home />}></Route>
              <Route path="/home" element={<Home />}></Route>
              <Route path="/listings" element={<Listings />}></Route>
              <Route path="/user/:id" element={<User />}></Route>
              <Route path="/companies" element={<Companies />}></Route>
              <Route path="/company/:companyId" element={<CompanyPage />}>
                <Route
                  path=""
                  element={<Navigate to="about"></Navigate>}
                ></Route>
                <Route path="about" element={<AboutCompany />}></Route>
                <Route path="listings" element={<CompanyListings />}></Route>
                <Route path="reviews" element={<CompanyReviews />}></Route>
                <Route path="add-review" element={<AddReviewPage />}></Route>
              </Route>
              <Route path="/listing/:id" element={<ListingPage />}></Route>
              <Route path="*" element={<NotFound />}></Route>
              <Route path="/addcompany" element={<AddCompanyPage />}></Route>
              <Route
                path="/signin"
                element={<AuthenticatedGuard>{<SignIn />}</AuthenticatedGuard>}
              ></Route>
              <Route
                path="/signup"
                element={<AuthenticatedGuard>{<SignUp />}</AuthenticatedGuard>}
              ></Route>
            </Route>
          </Routes>
          {/* </GuardProvider> */}
          {/* </BrowserRouter> */}
        </div>
      </AuthStateProvider>
    </ThemeProvider>
  );
}

export default App;
