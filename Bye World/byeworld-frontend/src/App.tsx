import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material";
import { Navigate, Route, Routes } from "react-router";
import { SignUp } from "./components/SignUp/Signup";
import { SignIn } from "./components/SignIn/Signin";
import { Listings } from "./components/listings/ListingsPage";
import { Navbar } from "./components/common/Navbar/Navbar";
import { Home } from "./components/Home/Home";
import UserPage from "./components/UserPage/UserPage";
import Companies from "./components/CompaniesPage/CompaniesPage";
import NotFound from "./components/NotFound/NotFound";
import AddCompanyPage from "./components/AddCompanyPage/AddCompanyPage";
import CompanyPage from "./components/CompanyPage/CompanyPage";
import { AuthStateProvider } from "./contexts/auth.context";
import ListingPage from "./components/ListingPage/ListingPage";
import AboutCompany from "./components/CompanyPage/AboutCompany";
import CompanyListings from "./components/CompanyPage/CompanyListings";
import CompanyReviews from "./components/CompanyPage/CompanyReviews";
import AddReviewPage from "./components/CompanyPage/AddReviewPage";
import AuthenticatedGuard from "./components/common/RouteGuards/AuthenticatedGuard";
import FavListings from "./components/UserPage/FavListings";
import UserReviews from "./components/UserPage/UserReviews";
import UserCompanies from "./components/UserPage/UserCompanies";
import UpdateCompanyPage from "./components/UpdateCompanyPage/UpdateCompanyPage";
const theme = createTheme({
  palette: {
    primary: {
      light: "#fbc02d",
      main: "#311b92",
      dark: "#000063",
    },
    secondary: {
      light: "#ffd54f",
      main: "#fdd835",
      dark: "#c29fob",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthStateProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route path="" element={<Home />}></Route>
              <Route path="/home" element={<Home />}></Route>
              <Route path="/listings" element={<Listings />}></Route>
              <Route path="/user/:userId" element={<UserPage />}>
                <Route
                  path=""
                  element={<Navigate to="fav-listings"></Navigate>}
                ></Route>
                <Route path="fav-listings" element={<FavListings />}></Route>
                <Route path="reviews" element={<UserReviews />}></Route>
                <Route path="companies" element={<UserCompanies />}></Route>
              </Route>
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
              <Route path="/updatecompany" element={<UpdateCompanyPage />}></Route>
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
        </div>
      </AuthStateProvider>
    </ThemeProvider>
  );
}

export default App;
