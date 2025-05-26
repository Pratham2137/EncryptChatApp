import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home/Home";
import Logout from "./components/Auth/Logout";
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import Layout from "./layout/Layout.tsx";
import NotFound from "./components/NotFound.tsx";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "./features/store.ts";
import { ThemeProvider } from "./utils/ThemeContext.tsx";

function App() {
  const theme = useSelector((s: RootState) => s.theme);

  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route element={<Layout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
