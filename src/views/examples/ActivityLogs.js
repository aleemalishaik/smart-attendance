import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "components/Headers/Header";
import { Card, CardBody, Container, Row, Col, Table, Button } from "reactstrap";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await axios.get("http://localhost:8080/api/logs/all", {
        headers: { Authorization: token },
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const convertTimestampToDate = (timestampArray) => {
    if (!timestampArray || timestampArray.length < 6) return "Invalid Date";
    const [year, month, day, hour, minute, second, millisecond] = timestampArray;
    return new Date(year, month - 1, day, hour, minute, second, millisecond).toLocaleString();
  };

  // ✅ Updated downloadCSV function with Authorization
  const downloadCSV = async () => {
    try {
      const token = localStorage.getItem("Authorization");

      const response = await axios.get("http://localhost:8080/api/logs/export-csv", {
        headers: { Authorization: token },
        responseType: "blob", // Important for file downloads
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "activity_logs.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download logs. Check authentication.");
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">

              <CardBody>
                <h3>Activity & Logs</h3>
                <Table responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>ID</th>
                      <th>Timestamp</th>
                      <th>Action</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td>{log.id}</td>
                        <td>{convertTimestampToDate(log.timestamp)}</td>
                        <td>{log.action}</td>
                        <td>{log.details || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            <Button color="primary" onClick={downloadCSV}>
              Export Logs (CSV)
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ActivityLogs;
