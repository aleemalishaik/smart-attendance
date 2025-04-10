import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import { CSVLink } from "react-csv";
import Header from "components/Headers/Header.js";

const Tables = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("Authorization");
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchAdmins()]);
    setLoading(false);
  };

  const fetchUsers = async () => {
    if (!token) {
      console.error("No authentication token found.");
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/users/all`, {
        headers: {
          Authorization: token,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        alert("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("Authorization");
        window.location.href = "/auth/login";
      }
    }
  };

  const fetchAdmins = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${BASE_URL}/admin/all`, {
        headers: { Authorization: token },
      });
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const csvDataUsers = users.map((user) => ({
    "User Id": user.employeeId,
    Username: user.name,
    Email: user.email,
    "Image Path": user.imagePath,
    "Created At": user.createdAtFormatted,
  }));

  const csvDataAdmins = admins.map((admin) => ({
    "Admin Id": admin.id,
    Username: admin.username,
    Email: admin.email,
    "Super Admin": admin.isSuperAdmin ? "Yes" : "No",
    "Created At": admin.createdAtFormatted,
  }));

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-4" lg="6">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">ADMINS</h3>

              </CardHeader>
              <CardBody>
                {loading ? (
                  <p>Loading admin data...</p>
                ) : (
                  <Table className="align-items-center table-hover table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Admin Id</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Super Admin</th>
                        <th scope="col">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr key={admin.id}>
                          <td>{admin.id}</td>
                          <td>{admin.username}</td>
                          <td>{admin.email}</td>
                          <td>{admin.isSuperAdmin ? "Yes" : "No"}</td>
                          <td>{admin.createdAtFormatted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
              <CSVLink
                data={csvDataAdmins}
                filename="admins_data.csv"
                className="btn btn-primary m-3"
                target="_blank"
              >
                Export Admins (CSV)
              </CSVLink>
            </Card>
          </Col>

          <Col lg="6">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">USERS</h3>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <p>Loading user data...</p>
                ) : (
                  <Table className="align-items-center table-hover table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">User Id</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Image Path</th>
                        <th scope="col">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.employeeId}>
                          <td>{user.employeeId}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.imagePath}</td>
                          <td>{user.createdAtFormatted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
              <CSVLink
                data={csvDataUsers}
                filename="users_data.csv"
                className="btn btn-primary m-3"
                target="_blank"
              >
                Export Users (CSV)
              </CSVLink>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Tables;
