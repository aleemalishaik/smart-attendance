import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import Header from "components/Headers/Header.js";

const SystemSettings = () => {
  const [settings, setSettings] = useState(null);
  const [updatedSettings, setUpdatedSettings] = useState({});
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("Authorization");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/settings`, {
        headers: { Authorization: token },
      });
      setSettings(response.data);
      setUpdatedSettings(response.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e) => {
    setUpdatedSettings({ ...updatedSettings, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/settings`, updatedSettings, {
        headers: { Authorization: token, "Content-Type": "application/json" },
      });
      showNotification("success", response.data);
      setIsModalOpen(false);
      fetchSettings();
    } catch (error) {
      showNotification("danger", error.response?.data || "Failed to update settings!");
    }
  };

  return (
    <>
      {notification && (
        <Alert color={notification.type} toggle={() => setNotification(null)} className="alert-slide-up fade show">
          {notification.message}
        </Alert>
      )}
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">SYSTEM SETTINGS</h3>
              </CardHeader>
              <CardBody>

                {settings ? (
                  <div>
                    <p><strong>Start Time:</strong> {settings.startTime}</p>
                    <p><strong>End Time:</strong> {settings.endTime}</p>
                    <p><strong>On-Time Limit:</strong> {settings.onTimeLimit}</p>
                    <p><strong>Late Limit:</strong> {settings.lateLimit}</p>
                  </div>
                ) : (
                  <p>No system settings found.</p>
                )}
              </CardBody>
            </Card>
            <Button color="primary" onClick={() => setIsModalOpen(true)}>
              Edit Settings
            </Button>
          </div>
        </Row>
      </Container>

      {/* Modal for Updating Settings */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader toggle={() => setIsModalOpen(false)}>Update Settings</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Start Time</Label>
              <Input
                type="time"
                name="startTime"
                value={updatedSettings.startTime || ""}
                onChange={handleChange}
                className="input-group-alternative"
              />
            </FormGroup>
            <FormGroup>
              <Label>End Time</Label>
              <Input
                type="time"
                name="endTime"
                value={updatedSettings.endTime || ""}
                onChange={handleChange}
                className="input-group-alternative"
              />
            </FormGroup>
            <FormGroup>
              <Label>On-Time Limit</Label>
              <Input
                type="time"
                name="onTimeLimit"
                value={updatedSettings.onTimeLimit || ""}
                onChange={handleChange}
                className="input-group-alternative"
              />
            </FormGroup>
            <FormGroup>
              <Label>Late Limit</Label>
              <Input
                type="time"
                name="lateLimit"
                value={updatedSettings.lateLimit || ""}
                onChange={handleChange}
                className="input-group-alternative"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
          <Button color="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default SystemSettings;
