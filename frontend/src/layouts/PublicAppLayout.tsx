import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/reduxTK/hooks";

function PublicAppLayout() {
  const { status } = useAppSelector((state) => state.auth);

  // Wait while auth is being resolved
  if (status === "checking") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // If logged in → block public pages
  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → allow public pages
  return <Outlet />;
}

export default PublicAppLayout;
