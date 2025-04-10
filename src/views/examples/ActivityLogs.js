import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "components/Headers/Header";
import { Card, CardBody, Container, Row, Col, Table } from "reactstrap";
import { CSVLink } from "react-csv"; // Import CSVLink from react-csv

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/logs/all`, {
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

  // Prepare the data for CSV export
  const csvData = logs.map((log) => ({
    ID: log.id,
    Timestamp: convertTimestampToDate(log.timestamp),
    Action: log.action,
    Details: log.details || "N/A",
  }));

  const csvHeaders = [
    { label: "ID", key: "ID" },
    { label: "Timestamp", key: "Timestamp" },
    { label: "Action", key: "Action" },
    { label: "Details", key: "Details" },
  ];

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        {/* Export Button with CSVLink */}
        <Row  className="mb-3">
          <Col className="text-right">
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename="activity_logs.csv"
              className="btn btn-primary mt-3 "
            >
              Export Logs (CSV)

            </CSVLink>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="shadow">
              <CardBody>
                <h3 className="mb-4">ACTIVITY & LOGS</h3>
                <Table className="table-hover table-flush" responsive>
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


          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ActivityLogs;
