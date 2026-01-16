import { Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { useEffect } from "react";
import { useAppDispatch } from "@/reduxTK/hooks";
import { restoreAuth } from "@/reduxTK/slices/authSlice";

function App() {
  // prevents user from being logged out on refresh.
  const dispatch = useAppDispatch();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(restoreAuth(token));
    }
  }, []);
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
