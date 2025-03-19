import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, Container, Row, Table } from "reactstrap";
import Header from "components/Headers/Header.js";

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
      const response = await axios.get("http://localhost:8080/api/attendance/all", {
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



  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Attendance Records</h3>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
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
