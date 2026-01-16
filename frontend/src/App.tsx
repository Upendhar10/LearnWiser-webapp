import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "@/reduxTK/hooks";
import { setLoginUser, authFailed } from "@/reduxTK/slices/authSlice";
import PublicAppLayout from "./layouts/PublicAppLayout";
import ProtectedAppLayout from "./layouts/ProtectedAppLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboadPage from "./pages/DashboadPage";
import LandingPage from "./pages/LandingPage";
import { authService } from "./services/auth.service";

function App() {
  // To prevents user from being logged out on refresh.
  const dispatch = useAppDispatch();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    authService
      .getMe()
      .then((res) => dispatch(setLoginUser(res.data)))
      .catch(() => dispatch(authFailed()));
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicAppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedAppLayout />}>
        <Route path="/dashboad" element={<DashboadPage />} />
      </Route>
    </Routes>
  );
}

export default App;
