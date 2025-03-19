import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Button, Card, CardBody, Col, Alert } from "reactstrap";

const CapturePhoto = ({ onScanComplete }) => {
    const webcamRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const capture = useCallback(async () => {
        if (!webcamRef.current) return;

        setScanning(true);
        setError(null);
        setSuccessMessage(null);

        const imageSrc = webcamRef.current.getScreenshot({ width: 640, height: 480 });

        if (!imageSrc) {
            setError("Failed to capture image. Please try again.");
            setScanning(false);
            return;
        }

        // Convert Base64 directly to Blob (better method)
        const blob = await fetch(imageSrc).then(res => res.blob());

        const formData = new FormData();
        formData.append("file", blob, "scan.jpg");

        try {
            const response = await fetch("http://localhost:8080/api/face_auth/scan", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.employeeId) {
                setSuccessMessage(`Attendance marked for Employee ID: ${result.employeeId}`);
            } else {
                setError(result.message || "Face not recognized!");
            }
        } catch (error) {
            setError("Scan failed! contact your admin for more info.");
            console.error("Error scanning face:", error);
        } finally {
            setScanning(false);
        }
    }, []);

    // Automatically fade out messages after 4 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            setError(null);
            setSuccessMessage(null);
        }, 4000);

        return () => clearTimeout(timeout); // Cleanup timeout
    }, [error, successMessage]);

    return (
        <Col lg="5" md="8">
            <Card className="bg-secondary shadow border-0">
                <CardBody className="px-lg-4 py-lg-4 text-center">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        height="auto"
                        videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                        style={{ borderRadius: "5px" }}
                    />
                    <Button color="primary" onClick={capture} disabled={scanning} className="mt-3">
                        {scanning ? "Scanning..." : "Scan Now"}
                    </Button>

                    {/* Show Success Message */}
                    {successMessage && (
                        <Alert color="success" className="mt-3 fade show">
                            {successMessage}
                        </Alert>
                    )}

                    {/* Show Error Message */}
                    {error && (
                        <Alert color="danger" className="mt-3 fade show">
                            {error}
                        </Alert>
                    )}
                </CardBody>
            </Card>
        </Col>
    );
};

export default CapturePhoto;
