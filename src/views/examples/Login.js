import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
  UncontrolledAlert
} from "reactstrap";

const Login = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [identifier, setIdentifier] = useState(""); // ✅ Changed "username" to "identifier"
  const [password, setPassword] = useState(""); // Store password
  const [error, setError] = useState(""); // Store error messages
  const [loading, setLoading] = useState(false); // Track login request

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous errors
    setLoading(true); // Show loading state

    console.log("🔍 Logging in with:", identifier, password); // ✅ Debugging log

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/login`, {
        identifier, // ✅ Correct field name (username or email)
        password,
      });


      if (response.data.token) {
        localStorage.setItem("Authorization", "Bearer " + response.data.token); // Store token properly
        navigate("/admin/index"); // Redirect to dashboard
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error("❌ Login error:", err); // ✅ Log the error
      if (err.response) {
        setError(err.response.data.message || "Login failed. Please try again.");
      } else {
        setError("Unable to connect to the server. Please check your connection.");
      }
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <>
      {/* Floating alert outside the login card */}
      {error && (
        <div className="login-alert-wrapper">
          <UncontrolledAlert color="danger" fade className="alert-slide-up alert-dismissible">
            <span className="alert-inner--text">{error}</span>
          </UncontrolledAlert>
        </div>
      )}
  
      <Col lg="4" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-4 py-lg-4">
            <div className="text-center">
              <i className="ni ni-single-02" />
            </div>
            <div className="text-center text-muted mb-4">
              <small><strong>LOGIN WITH YOUR CREDENTIALS</strong></small>
            </div>
  
            <Form role="form" onSubmit={handleLogin}>
              {/* Identifier Field */}
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><i className="ni ni-circle-08" /></InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Username or Email"
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
  
              {/* Password Field */}
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><i className="ni ni-lock-circle-open" /></InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
  
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "LOGIN"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}  

export default Login;