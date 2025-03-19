/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import AdminNavbar from 'components/Navbars/AdminNavbar';
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Container,
  Row,
} from 'reactstrap';
// Core Components
import Header from 'components/Headers/Header.js';

const Tables = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("Authorization"); // ✅ Corrected key: "Authorization"

  useEffect(() => {
    fetchUsers();
  }, []); // ✅ No dependency warning now

  const fetchUsers = async () => {
    if (!token) {
      console.error("No authentication token found.");
      return;
    }
    try {
      const response = await axios.get("http://localhost:8080/api/users/all", {
        headers: {
          Authorization: token, // ✅ Corrected: send the token with Bearer prefix
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        alert("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("Authorization"); // Corrected: remove the correct item.
        window.location.href = "/auth/login"; // Redirect to login page
      }
    }
  };

  return (
    <>
      {/* <AdminNavbar /> */}
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">User List</h3>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">User Id</th>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">Image path</th>
                      <th scope="col">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.employeeId}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.imagePath}</td>
                        <td>{user.createdAtFormatted}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Tables;