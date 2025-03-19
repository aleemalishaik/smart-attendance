import { useState, useEffect } from "react";
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
    UncontrolledAlert, // ✅ Imported Alert Component
    UncontrolledTooltip
} from "reactstrap";
import axios from "axios";
import Header from "components/Headers/Header.js";
const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState({ id: 0, username: "", email: "", isSuperAdmin: false, createdAtFormatted: "" });
    const [notification, setNotification] = useState(null);
    const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
    const [isSuperAdmin, setisSuperAdmin] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ username: "", email: "", password: "", isSuperAdmin: false });


    const token = localStorage.getItem("Authorization");

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        if (!token) return;

        try {
            const response = await axios.get("http://localhost:8080/api/admin/all", {
                headers: { Authorization: token },
            });
            setAdmins(response.data);
        } catch (error) {
            console.error("Error fetching admins:", error);
            handleAuthError(error);
        }
    };


    const handleAuthError = (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            showNotification("danger", "Session expired. Please log in again.");
            localStorage.removeItem("Authorization");
            window.location.href = "/auth/login";
        }
    };

    const handleNewAdminChange = (e) => {
        const { name, value } = e.target;
        setNewAdmin({ ...newAdmin, [name]: value });
    };

    const openUpdateModal = (admin) => {
        setSelectedAdmin(admin);
        setModalOpen(true);
    };

    const openDeleteModal = (admin) => {
        setSelectedAdmin(admin);
        setDeleteModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedAdmin({ ...selectedAdmin, [name]: value });
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleAddAdmin = async () => {
        if (!token) return;
        if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
            showNotification("warning", "All fields are required!");
            return;
        }
        console.clear();
        console.log(newAdmin);
        try {
            console.log(newAdmin);
            const response = await axios.post("http://localhost:8080/api/admin/register", newAdmin, {
                headers: { Authorization: token, "Content-Type": "application/json" },
            });
            console.log(newAdmin);
            showNotification("success", response.data);
            fetchAdmins();
            setAddAdminModalOpen(false);
        } catch (error) {
            console.error("Error adding admin:", error);
            showNotification("danger", error.response?.data || "Failed to add admin.");
        }
    };


    const handleUpdateAdmin = async () => {
        if (!token) return;

        const updates = {};
        if (selectedAdmin.username.trim()) updates.username = selectedAdmin.username.trim();
        if (selectedAdmin.email.trim()) updates.email = selectedAdmin.email.trim();

        try {
            const response = await axios.patch(
                `http://localhost:8080/api/admin/update/${selectedAdmin.id}`,
                updates,
                { headers: { Authorization: token } }
            );

            showNotification("success", response.data);
            fetchAdmins();
            setModalOpen(false);
        } catch (error) {
            console.error("Error updating admin:", error);
            showNotification("danger", error.response?.data || "Failed to update admin.");
        }
    };

    const handleDeleteAdmin = async () => {
        if (!token) return;

        try {
            const response = await axios.delete(
                `http://localhost:8080/api/admin/delete?username=${selectedAdmin.username}`,
                { headers: { Authorization: token } }
            );

            showNotification("success", response.data);
            fetchAdmins();
            setDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting admin:", error);
            showNotification("danger", error.response?.data || "Failed to delete admin.");
        }
    };


    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Admins List</h3>
                            </CardHeader>
                            <CardBody>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Admin Id</th>
                                            <th scope="col">Username</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Super Admin</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col">Actions</th>
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
                                                <td>
                                                    <Button color="info" size="sm" onClick={() => openUpdateModal(admin)}>Edit</Button>
                                                    <Button color="danger" size="sm" onClick={() => openDeleteModal(admin)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                        <Button color="primary" onClick={() => setAddAdminModalOpen(true)}>
                            Add Admin
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
                <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Update Admin</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="username" className="form-control-label">Username</Label>
                            <InputGroup className="input-group-alternative">
                                <Input type="text" name="username" value={selectedAdmin.username} onChange={handleInputChange} />

                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label for="email" className="form-control-label">Email</Label>
                            <InputGroup className="input-group-alternative">
                                <Input type="email" name="email" value={selectedAdmin.email} onChange={handleInputChange} />

                            </InputGroup>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdateAdmin}>Save Changes</Button>
                    <Button color="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>

            {/* ✅ Delete User Modal */}
            <Modal isOpen={deleteModalOpen} toggle={() => setDeleteModalOpen(!deleteModalOpen)}>
                <ModalHeader toggle={() => setDeleteModalOpen(!deleteModalOpen)}>Delete Admin</ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete Admin <strong>{selectedAdmin.username}</strong>?</p>

                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDeleteAdmin}>Yes, Delete</Button>
                    <Button color="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>

            {/* Add Admin Modal */}
            <Modal isOpen={addAdminModalOpen} toggle={() => setAddAdminModalOpen(!addAdminModalOpen)}>
                <ModalHeader toggle={() => setAddAdminModalOpen(!addAdminModalOpen)}>Add New Admin</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="name" className="form-control-label">Username</Label>
                            <InputGroup className="input-group-alternative">
                                <Input type="text" name="username" value={newAdmin.username} onChange={handleNewAdminChange} />
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label for="email" className="form-control-label">Email</Label>
                            <InputGroup className="input-group-alternative">
                                <Input type="email" name="email" value={newAdmin.email} onChange={handleNewAdminChange} />
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-control-label">Password</Label>
                            <InputGroup className="input-group-alternative">
                                <Input type="password" name="password" value={newAdmin.password} onChange={handleNewAdminChange} />
                            </InputGroup>
                        </FormGroup>
                        <Label for="isSuperAdmin" className="form-control-label">Super Admin</Label>
                        <FormGroup>
                            <label className="custom-toggle">
                                <input
                                    type="checkbox"
                                    checked={newAdmin.isSuperAdmin}  // Bind this to newAdmin.isSuperAdmin
                                    onChange={(e) => setNewAdmin({ ...newAdmin, isSuperAdmin: e.target.checked })}  // Update isSuperAdmin field in newAdmin
                                />

                                <span className="custom-toggle-slider rounded-circle" id="tooltip-super-admin" data-placement="right" />
                                {/*Take Input to set super admin*/}
                            </label>
                            <UncontrolledTooltip delay={0} placement="right" target="tooltip-super-admin">
                                {"Toggle Set True"}
                            </UncontrolledTooltip>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAddAdmin}>Add Admin</Button>
                    <Button color="secondary" onClick={() => setAddAdminModalOpen(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>


        </>
    );
};

export default ManageAdmins;
