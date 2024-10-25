import { Outlet, Navigate } from "react-router-dom";
import { NavBar } from "src/components/NavBar";
import { useUser } from "src/utils/useUser";


const PrivateRoutes = ({ admin = false }) => {
  const user = useUser();

  if (!user) return <Navigate to="/login" />;

  return !admin || user.is_admin ? (
    <div className="d-flex">
      <NavBar />
      <div style={{
        width: "calc(100vw - 250px)"
      }}>
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoutes;
