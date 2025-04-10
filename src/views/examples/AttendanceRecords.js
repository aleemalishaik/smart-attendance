import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, Container, Row, Table, Col } from "reactstrap";
import Header from "components/Headers/Header.js";
import { CSVLink } from "react-csv"; // Import CSVLink from react-csv

const AttendanceRecords = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    const token = localStorage.getItem("Authorization");

    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/attendance/all`, {
        headers: { Authorization: token },
      });

      console.log("📌 Attendance Data:", response.data); // ✅ Debugging
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  const formatDateTime = (dateInput) => {
    if (!dateInput) return "N/A"; // Handle empty values

    let date;

    if (Array.isArray(dateInput)) {
      // ✅ Convert array to ISO format: "YYYY-MM-DDTHH:mm:ss.sss"
      const [year, month, day, hour, minute, second] = dateInput;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) {
      console.error("❌ Invalid Date Found:", dateInput);
      return "Invalid Date";
    }

    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Prepare the data for CSV export
  const csvData = attendance.map((record) => ({
    "User ID": record.employeeId,
    "Name": record.name,
    "Scanned At": formatDateTime(record.scannedAt),
    "Status": record.status,
  }));

  const csvHeaders = [
    { label: "User ID", key: "User ID" },
    { label: "Name", key: "Name" },
    { label: "Scanned At", key: "Scanned At" },
    { label: "Status", key: "Status" },
  ];

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        {/* Align the CSV export button to the right */}
        <Row className="mb-3">
          <Col className="text-right">  {/* Align button to the right */}
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename="attendance_records.csv"
              className="btn btn-primary"
            >
              Export Attendance Records (CSV)
            </CSVLink>
          </Col>
        </Row>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Attendance Records</h3>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-hover table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Scanned At</th>  {/* ✅ Updated header */}
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record, index) => (
                      <tr key={index}>
                        <td>{record.employeeId}</td>
                        <td>{record.name}</td>
                        <td>{formatDateTime(record.scannedAt)}</td>  {/* ✅ Fixed field */}
                        <td>{record.status}</td>
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

export default AttendanceRecords;
