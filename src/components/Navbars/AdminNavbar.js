import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { useEffect, useState } from "react";

const AdminNavbar = ({ admin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || require("D:/smart attendance/src/assets/img/admin/angular.jpg")
  );

  // **Extract Active Page Name**
  const getActivePageName = () => {
    let path = location.pathname.split("/").pop();
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Dashboard"; // Default to "Dashboard" if empty
  };

  // Update profile image from localStorage on component mount
  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    navigate("/auth/login");
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          {/* Active Page Name */}
          <Link className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block">
            {getActivePageName()}
          </Link>
          
          {/* Search Bar */}
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form>

          {/* Profile & Logout */}
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img alt="Admin" src={profileImage} className="brand-logo" />
                  </span>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem onClick={handleLogout}>
                  <i className="ni ni-button-power" /> Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
