import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Tooltip,
  InputGroup,
  Alert,
} from "reactstrap";
import Header from "components/Headers/Header.js";

const FaceTraining = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("Authorization");

  // ✅ State for notifications
  const [notification, setNotification] = useState({ message: "", type: "" });
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    console.log("🔍 REACT_APP_BACKEND_URL =", process.env.REACT_APP_BACKEND_URL); // ✅ This logs the env variable
    console.log("🔍 REACT_APP_PYTHON_URL =", process.env.REACT_APP_PYTHON_URL); // ✅ This logs the env variable
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/images`, {
        headers: { Authorization: token },
      });

      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const extractImageName = (imagePath) => {
    // Extract filename from path
    const filename = imagePath.split("/").pop(); // Get image name
    return filename; // Fallback
  };

  const toggleTooltip = (index) => {
    setTooltipOpen(tooltipOpen === index ? null : index);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdateFace = async () => {
    if (!employeeId || !name || !file) {
      setNotification({ type: "danger", message: "All fields are required!" });
      return;
    }

    const formData = new FormData();
    formData.append("employee_id", employeeId);
    formData.append("name", name);
    formData.append("file", file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_PYTHON_URL}/update_face`, formData);
      setNotification({ type: "success", message: response.data.message }); // ✅ Show success notification
      setIsModalOpen(false);
    } catch (error) {
      setNotification({ type: "danger", message: error.response?.data?.detail || "Failed to update face!" }); // ✅ Show error notification
    }

  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-4 ">
                  <i className="fas fa-ban fa-lg text-red mr-2"></i>
                  You Can Only Train The Faces Again For The Users Who Are Already Registered.
                </h3>
              </CardHeader>
              <CardBody>
                {/* ✅ Show Notification Here */}
                {notification.message && (
                  <Alert color={notification.type} toggle={() => setNotification({ message: "", type: "" })}>
                    {notification.message}
                  </Alert>
                )}

                <Row>
                  {images.map((image, index) => (
                    <Col md="3" key={index} className="mb-4 text-center">
                      <div
                        id={`tooltip-${index}`}
                        className="position-relative"
                        onClick={() => handleImageClick(image)}
                        style={{
                          cursor: "pointer",
                          border: "2px solid transparent",
                          borderRadius: "8px",
                          transition: "0.3s",
                          boxShadow: tooltipOpen === index ? "0px 0px 8px rgba(0,0,0,0.3)" : "none",
                        }}
                      >
                        <img
                          src={`${process.env.REACT_APP_BACKEND_URL}${image}`}
                          alt="Face"
                          className="img-fluid rounded"
                          style={{
                            width: "100%", // Set a fixed width
                            height: "250px", // Maintain consistent height (adjustable)
                            objectFit: "cover", // Ensure image fills the space without stretching
                            borderRadius: "8px", // Rounded corners for better look
                          }}
                        />
                      </div>

                      {/* ✅ Display Image Name Below Image */}
                      <p className="mt-2 font-weight-bold">{extractImageName(image)}</p>

                      <Tooltip
                        placement="top"
                        isOpen={tooltipOpen === index}
                        target={`tooltip-${index}`}
                        toggle={() => toggleTooltip(index)}
                      >
                        Click the image to update.
                      </Tooltip>
                    </Col>
                  ))}
                </Row>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ✅ Modal for Updating Face */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader toggle={() => setIsModalOpen(false)}>Update Face</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label className="form-control-label">Employee ID</Label>
              <Input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="Enter Employee ID" className="input-group-alternative" />
            </FormGroup>
            <FormGroup>
              <Label className="form-control-label">Name</Label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className="input-group-alternative" />
            </FormGroup>
            <FormGroup>
              <Label className="form-control-label">Upload New Image</Label>
              <InputGroup>
                {/* Custom file input trigger button */}
                <Button
                  color="default"
                  onClick={() => document.getElementById("update-file-input").click()}
                  style={{ width: "50%" }}
                >
                  Choose Image
                </Button>
                {/* Hidden file input */}
                <Input
                  type="file"
                  accept="image/*"
                  id="update-file-input"
                  style={{ display: "none" }} // Hide default input
                  onChange={handleFileChange}
                />
              </InputGroup>

              {/* Display selected file name */}
              {file && (
                <div className="mt-2">
                  <strong>Selected File: </strong> {file.name}
                </div>
              )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdateFace}>Update Face</Button>
          <Button color="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default FaceTraining;
