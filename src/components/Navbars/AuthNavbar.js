import { useLocation } from "react-router-dom"; // ✅ Import useLocation
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  Container,
} from "reactstrap";
import Navs from "../Navs/Navs.js"; // ✅ Import Navs Component

const AuthNavbar = () => {
  const location = useLocation(); // ✅ Get the current route path

  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-light" expand="md">
        <Container className="px-1">
          <NavbarBrand>
            <img alt="..." src={require("../../assets/img/brand/brand.png")} />
          </NavbarBrand>

          {/* ✅ Hide Hamburger Menu ONLY on the Login Page */}
          {location.pathname !== "/auth/login" || "/auth/Scanning" && (
            <>
              <button className="navbar-toggler" id="navbar-collapse-main">
                <span className="navbar-toggler-icon" />
              </button>
              <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
                <div className="navbar-collapse-header d-md-none"></div>
              </UncontrolledCollapse>
            </>
          )}

          {/* Add Navs Component to Navbar */}
          {location.pathname !== "/auth/login" && (
            <Navs />  
          )}

        </Container>
      </Navbar>
    </>
  );
};

export default AuthNavbar;
