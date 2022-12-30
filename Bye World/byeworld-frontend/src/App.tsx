import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material";
import { Route, Routes } from "react-router";
import { SignUp } from "./components/SignUp/Signup";
import { SignIn } from "./components/SignIn/Signin";
import { UserProvider } from "./contexts/user.context";

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
        <div className="App">
          <Routes>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Routes>
          <header className="App-header">
            <p className="text-4xl underline animate-ping">Milan Stojkovic</p>
          </header>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
