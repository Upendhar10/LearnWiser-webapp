import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/reduxTK/hooks";

const ProtectedAppLayout = () => {
  const { status } = useAppSelector((state) => state.auth);

  // Auth check in progress
  if (status === "checking") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Not authenticated → redirect
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  // Authenticated → render protected content
  return <Outlet />;
};

export default ProtectedAppLayout;
