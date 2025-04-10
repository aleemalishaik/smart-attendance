import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  Row,
  Col,
} from "reactstrap";
import Header from "components/Headers/Header.js";

const UserStats = () => {
  const { employeeId } = useParams();
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("Authorization");
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/stats/${employeeId}`, {
        headers: { Authorization: token },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";

    let date;
    if (Array.isArray(dateInput)) {
      const [year, month, day, hour, minute, second] = dateInput;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) {
      console.error("Invalid Date Found:", dateInput);
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

  const downloadCSV = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/stats/export-csv/${employeeId}`, {
        headers: { Authorization: token },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${stats.name}_stats.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download stats. Check authentication.");
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mb-3">
          <Col className="text-right">
            <Button color="primary" onClick={downloadCSV}>
              Export Stats (CSV)
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xl="12">
            <Card className="shadow">
              <CardHeader className="bg-transparent mb-0" style={{ borderBottom: "none" }}>
                <h2 className="mb-0">USER STATISTICS</h2>
              </CardHeader>
              <CardBody>
                {stats ? (
                  <>
                    <h3>Name: {stats.name} </h3>
                    <h3>Employee Id : {stats.employeeId}</h3>
                    <h3>Email: {stats.email}</h3>
                    <h3>Total Attendance Days: {stats.totalDays}</h3>
                    <h3>Present Days: {stats.presentDays}</h3>
                    <h3>Attendance Percentage: <strong>{stats.attendancePercentage}%</strong></h3>

                    <h2 className="mt-5">ATTENDANCE RECORDS</h2>
                    <Table className="align-items-center table-hover table-flush" responsive>
                      <thead className="thead-light">
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.attendanceRecords.map((record, index) => (
                          <tr key={index}>
                            <td>{formatDate(record.scannedAt)}</td>
                            <td>{record.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <p>Loading stats...</p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserStats;
