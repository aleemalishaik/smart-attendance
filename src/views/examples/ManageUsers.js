import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  UncontrolledAlert // ✅ Imported Alert Component
} from "reactstrap";
import axios from "axios";
import Header from "components/Headers/Header.js";


const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // ✅ Delete Modal State
  const [selectedUser, setSelectedUser] = useState({ employeeId: "", name: "", email: "" });
  const [notification, setNotification] = useState(null); // ✅ Notification State
  const [addUserModalOpen, setAddUserModalOpen] = useState(false); // ✅ Add User Modal State
  const [newUser, setNewUser] = useState({ name: "", email: "", employeeId: "", file: null });

  const token = localStorage.getItem("Authorization");
  const navigate = useNavigate(); // ✅ useNavigate inside component


  const fetchUsers = async () => {
    if (!token) {
      console.error("No authentication token found.");
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/all`, {
        headers: { Authorization: token },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        showNotification("danger", "Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("Authorization");
        window.location.href = "/auth/login";
      }
    }
  };
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setNewUser({ ...newUser, file: e.target.files[0] });
  };

  // Open Update Modal
  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  // Handle input changes in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  // Show Notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleAddUser = async () => {
    if (!token) return;
    if (!newUser.name || !newUser.email || !newUser.employeeId || !newUser.file) {
      showNotification("warning", "All fields are required!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newUser.name.trim());
      formData.append("email", newUser.email.trim());
      formData.append("employeeId", newUser.employeeId.trim());
      formData.append("file", newUser.file);

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, formData, {
        headers: { Authorization: token, "Content-Type": "multipart/form-data" },
      });

      showNotification("success", response.data);
      fetchUsers(); // Refresh users list
      setAddUserModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error adding user:", error);
      showNotification("danger", error.response?.data || "Failed to add user.");
    }
  };


  // Update User API Call (PATCH)
  const handleUpdateUser = async () => {
    if (!token) return;

    const updates = {};
    if (selectedUser.name.trim()) updates.name = selectedUser.name.trim();
    if (selectedUser.email.trim()) updates.email = selectedUser.email.trim();

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/users/update/${selectedUser.employeeId}`,
        updates,
        { headers: { Authorization: token } }
      );

      showNotification("success", response.data);
      fetchUsers(); // Refresh users list
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification("danger", error.response?.data || "Failed to update user.");
    }
  };

  // ✅ Delete User API Call
  const handleDeleteUser = async () => {
    if (!token) return;

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/users/delete/${selectedUser.employeeId}`,
        { headers: { Authorization: token } }
      );

      showNotification("success", response.data); // Show Success Notification
      fetchUsers(); // Refresh users list
      setDeleteModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification("danger", error.response?.data || "Failed to delete user.");
    }
  };

  // ✅ Function to navigate to User Stats Page
  const viewStats = (employeeId) => {
    navigate(`/admin/user-stats/${employeeId}`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">USERS</h3>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-hover table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">User Id</th>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">Image Path</th>
                      <th scope="col">Created At</th>
                      <th scope="col">Actions</th>
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
                        <td>
                          <Button color="info" size="sm" onClick={() => viewStats(user.employeeId)}>
                            View Stats</Button>
                          <Button color="primary" size="sm" onClick={() => openUpdateModal(user)}>
                            Update
                          </Button>
                          <Button color="danger" size="sm" onClick={() => openDeleteModal(user)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            <Button color="primary" onClick={() => setAddUserModalOpen(true)}>
              Add New User
            </Button>

          </div>
        </Row>
        {/* ✅ Notification Alert */}
        {notification && (
          <UncontrolledAlert color={notification.type} fade>
            <span className="alert-inner--text">{notification.message}</span>
          </UncontrolledAlert>
        )}
      </Container>

      {/* ✅ Update User Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Update User</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name" className="form-control-label">Username</Label>
              <InputGroup className="input-group-alternative">
                <Input type="text" name="name" value={selectedUser.name} onChange={handleInputChange} />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="email" className="form-control-label">Email</Label>
              <InputGroup className="input-group-alternative">
                <Input type="email" name="email" value={selectedUser.email} onChange={handleInputChange} />
              </InputGroup>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdateUser}>Save Changes</Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* ✅ Delete User Modal */}
      <Modal isOpen={deleteModalOpen} toggle={() => setDeleteModalOpen(!deleteModalOpen)}>
        <ModalHeader toggle={() => setDeleteModalOpen(!deleteModalOpen)}>Delete User</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete user <strong>{selectedUser.name}</strong>?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteUser}>Yes, Delete</Button>
          <Button color="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={addUserModalOpen} toggle={() => setAddUserModalOpen(!addUserModalOpen)}>
        <ModalHeader toggle={() => setAddUserModalOpen(!addUserModalOpen)}>Add New User</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name" className="form-control-label">Username</Label>
              <InputGroup className="input-group-alternative">
                <Input type="text" name="name" value={newUser.name} onChange={handleNewUserChange} />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="email" className="form-control-label">Email</Label>
              <InputGroup className="input-group-alternative">
                <Input type="email" name="email" value={newUser.email} onChange={handleNewUserChange} />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="employeeId" className="form-control-label">Employee ID</Label>
              <InputGroup className="input-group-alternative"> <Input type="text" name="employeeId" value={newUser.employeeId} onChange={handleNewUserChange} /></InputGroup>
            </FormGroup>

            {/* Enhanced File Input */}
            <FormGroup>
              <Label for="file" className="form-control-label">Face Image</Label>
              <InputGroup >
                {/* Custom file input */}
                <Button
                  color="default"
                  onClick={() => document.getElementById("file-input").click()}
                  style={{ width: '50%' }}
                >
                  Choose Image
                </Button>
                <Input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="file-input"
                  style={{ display: 'none' }} // Hide default input
                />
                {newUser.file && (
                  <div className="mt-2">
                    <strong>Selected File: </strong>{newUser.file.name}
                  </div>
                )}
              </InputGroup>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddUser}>Add User</Button>
          <Button color="secondary" onClick={() => setAddUserModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>


    </>
  );
};

export default ManageUsers;
