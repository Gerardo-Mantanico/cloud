import { NavLink } from "react-router-dom";
import { Navbar } from "reactstrap";
import { useUser } from "src/utils/useUser";
import { LogOutButton } from "src/users/Logout";
import { Trees } from "src/Trees/Trees";
import logo from "src/assets/logo.png";
import { UsersIcon } from "./Icons";

export const NavBar = () => {
  const user = useUser();

  return (
    <Navbar color="dark" className="text-white d-flex min-vh-100 flex-column justify-content-start align-items-start" fixed="left" container={false} style={{
      width: "300px",
      overflow: "auto",
    }} dark>
      <NavLink to="/" className="ps-2 me-auto navbar-brand">
        <img width="40px" src={logo} className="mx-2 logo-cloud"/>
        Cloud Grafile
      </NavLink>
      <div className="px-3">
      <p>
  {user ? (
        <>
          {user.email} 
          <br />
          {user.first_name} {user.last_name}
          
        </>
      ) : (
        ""
      )}
    </p>
        <p>
          {user ? `${user.is_admin ? "(Administrador)" : ""}` : ""}
        </p>
      </div>

      <NavLink to="/usuarios" className="ps-2 me-auto">
        <UsersIcon />
        Usuarios
      </NavLink>
      <Trees />
      <LogOutButton />
    </Navbar>
  );
};
