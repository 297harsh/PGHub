import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

import { UserData } from "./context/UserData";
import PrivateRoute from "./PrivateRoute";
import { MainLayout, OwnerDashLayout } from "./layouts";
import { Home, Signin, Signup, VerifyEmail } from "./pages";

import "./App.css";
export default function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <UserData>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
              </Route>
              <Route
                path="/owner/*"
                element={<PrivateRoute element={OwnerDashLayout} />}
              />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Routes>
          </UserData>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
