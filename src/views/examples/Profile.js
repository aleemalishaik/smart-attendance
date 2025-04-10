import { useEffect, useState } from "react";
import axios from "axios";
import {
  InputGroupAddon,
  InputGroup,
  InputGroupText,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  Form,
  FormGroup,
  Input,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  ModalFooter,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";

const Profile = () => {
  const [admin, setAdmin] = useState({
    username: "",
    email: "",
    createdAtFormatted: "",
    superAdmin: false
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(""); // Store error messages
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [newPassword, setNewPassword] = useState(""); // Store new password
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm new password
  const [success, setSuccess] = useState("");
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || require("assets/img/admin/angular.jpg") // Load saved image
  );
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [formData, setFormData] = useState({
    username: admin.username,
    email: admin.email,
    // Add other fields as necessary
  });
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setError("");
    setSuccess("");
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        setError("No authorization token found. Please log in.");
        return;
      }

      // Remove empty values before sending the request
      const updatedData = {};
      if (formData.username.trim() !== "") updatedData.username = formData.username.trim();
      if (formData.email.trim() !== "") updatedData.email = formData.email.trim();
      if (newPassword.trim() !== "") updatedData.password = newPassword.trim();

      if (Object.keys(updatedData).length === 0) {
        setError("No changes detected.");
        return;
      }

      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/admin/update/${admin.id}`, updatedData, {
        headers: { Authorization: token },
      });

      // ✅ Force logout: Remove token and redirect to login
      localStorage.removeItem("Authorization");
      setSuccess("Profile updated successfully! Please log in again.");

      setTimeout(() => {
        window.location.href = "/auth/login"; // Redirect to login page
      }, 1500);

    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  // ✅ Fetch Admin Profile
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        if (!token) {
          setError("No authorization token found. Please log in.");
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/me`, {
          headers: { Authorization: token },
        });

        setAdmin(response.data); // Store fetched admin details
      } catch (err) {
        console.error("Error fetching admin details:", err);
        setError("Failed to load admin details.");
      }
    };

    fetchAdminDetails();
  }, []);

  // ✅ Handle Image Upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        localStorage.setItem("profileImage", e.target.result); // Save image in localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
     {/* <AdminNavbar admin={admin} /> */}
      <UserHeader admin={admin} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2 text-center" lg="3">
                  <div className="card-profile-image" >
                    {/* Label to trigger file upload */}
                    <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                      {/* Profile Image */}
                      <img
                        alt="Profile"
                        className="rounded-circle"
                        src={profileImage}
                        id="tooltip-pic"
                      />
                      <UncontrolledTooltip delay={0} placement="left" target="tooltip-pic" data-placement="left">
                            {"Click To add Photo"}
                          </UncontrolledTooltip>
                    </label>
                    {/* Hidden File Input */}
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </Col>

              </Row>
              <CardHeader className="border-0" style={{backgroundColor:"transparent"}}>
                <Row className="align-items-center mt-0">
                  <Col xs="8" className="mt-0">
                    <h3 className="mb-0 mt-0">MY ACCOUNT</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    Admin Information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">Username</label>
                          <Input
                            className="form-control-alternative"
                            value={admin.username}
                            id="input-username"
                            placeholder="Username"
                            type="text"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">Email Address</label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Email"
                            type="email"
                            value={admin.email}
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">Created At</label>
                          <Input
                            className="form-control-alternative"
                            value={admin.createdAtFormatted}
                            id="input-created-at"
                            type="text"
                            readOnly
                          />
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <label className="form-control-label">Super Admin</label>
                        <FormGroup>
                          <label className="custom-toggle">
                            <input type="checkbox" checked={admin.superAdmin} disabled />
                            <span className="custom-toggle-slider rounded-circle" id="tooltip-super-admin" data-placement="right" />
                          </label>
                          <UncontrolledTooltip delay={0} placement="right" target="tooltip-super-admin">
                            {admin.superAdmin
                              ? "You are a Super Admin (Cannot be changed)"
                              : "You are a regular Admin"}
                          </UncontrolledTooltip>
                        </FormGroup>
                      </Col>
                    </Row>

                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Button color="primary" onClick={toggleModal}>
          Edit Profile
        </Button>

        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Update Profile</ModalHeader>
          <ModalBody>
            {error && <Alert color="danger">{error}</Alert>}
            {success && <Alert color="success">{success}</Alert>}
            <Form onSubmit={handleFormSubmit}>
              <FormGroup>
                <Label for="username"  className="form-control-label">Username</Label>
                <InputGroup className="input-group-alternative">
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="email"  className="form-control-label">Email</Label>
                <InputGroup className="input-group-alternative">
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <FormGroup>
                  <label className="form-control-label">New Password</label>
                  <InputGroup className="input-group-alternative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <InputGroupAddon addonType="append">
                      <InputGroupText
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? (
                          <i className="fa fa-eye" />
                        ) : (
                          <i className="fa fa-eye-slash" />
                        )}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </FormGroup>
              <FormGroup>
                <FormGroup>
                  <label className="form-control-label">Confirm Password</label>
                  <InputGroup className="input-group-alternative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputGroupAddon addonType="append">
                      <InputGroupText
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? (
                          <i className="fa fa-eye" />
                        ) : (
                          <i className="fa fa-eye-slash" />
                        )}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </FormGroup>
              {/* Add other form fields as needed */}
              <ModalFooter>
                <Button color="secondary" onClick={toggleModal}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Save Changes
                </Button>
              </ModalFooter>
            </Form>
          </ModalBody>
        </Modal>
      </Container>
    </>
  );
};

export default Profile;
