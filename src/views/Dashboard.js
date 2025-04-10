import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Line, Pie } from "react-chartjs-2";
import { Card, CardHeader, CardBody, Container, Row, Col, Table, Button } from "reactstrap";
import Header from "components/Headers/Header.js";
import AdminNavbar from "components/Navbars/AdminNavbar";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Dashboard = () => {
  const [todayAttendance, setTodayAttendance] = useState({ onTime: 0, late: 0, absent: 0 });
  const [attendanceTrends, setAttendanceTrends] = useState({ labels: [], datasets: [] });
  const [hourlyAttendance, setHourlyAttendance] = useState({ labels: [], datasets: [] });
  const [leaderboard, setLeaderboard] = useState([]);
  const dashboardRef = useRef(null);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("Authorization");

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: token };

      const todayResponse = await axios.get(`${BASE_URL}/dashboard/today-summary`, { headers });
      setTodayAttendance(todayResponse.data);

      const weeklyResponse = await axios.get(`${BASE_URL}/dashboard/weekly-trend`, { headers });
      setAttendanceTrends({
        labels: weeklyResponse.data.days,
        datasets: [
          {
            label: "On Time",
            backgroundColor: "rgba(40,167,69,0.2)",
            borderColor: "#28a745",
            borderWidth: 2,
            fill: true,
            data: weeklyResponse.data.onTime,
          },
          {
            label: "Late",
            backgroundColor: "rgba(255,193,7,0.2)",
            borderColor: "#ffc107",
            borderWidth: 2,
            fill: true,
            data: weeklyResponse.data.late,
          },
          {
            label: "Absent",
            backgroundColor: "rgba(220,53,69,0.2)",
            borderColor: "#dc3545",
            borderWidth: 2,
            fill: true,
            data: weeklyResponse.data.absent,
          },
        ],
      });

      const hourlyResponse = await axios.get(`${BASE_URL}/dashboard/hourly-attendance`, { headers });
      setHourlyAttendance(processHourlyData(hourlyResponse.data));

      const leaderboardResponse = await axios.get(`${BASE_URL}/dashboard/leaderboard`, { headers });
      setLeaderboard(leaderboardResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const processHourlyData = (hourlyData) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    return {
      labels: hours,
      datasets: [
        {
          label: "On Time",
          backgroundColor: "rgba(40,167,69,0.2)",
          borderColor: "#28a745",
          borderWidth: 2,
          fill: true,
          data: hours.map((_, index) => hourlyData[`hour${index}`]?.onTime || 0),
        },
        {
          label: "Late",
          backgroundColor: "rgba(255,193,7,0.2)",
          borderColor: "#ffc107",
          borderWidth: 2,
          fill: true,
          data: hours.map((_, index) => hourlyData[`hour${index}`]?.late || 0),
        },
        {
          label: "Absent",
          backgroundColor: "rgba(220,53,69,0.2)",
          borderColor: "#dc3545",
          borderWidth: 2,
          fill: true,
          data: hours.map((_, index) => hourlyData[`hour${index}`]?.absent || 0),
        },
      ],
    };
  };

  const downloadPDF = () => {
    const input = dashboardRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      pdf.save("dashboard_report.pdf");
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pieChartData = {
    labels: ["On Time", "Late", "Absent"],
    datasets: [
      {
        data: [todayAttendance.onTime, todayAttendance.late, todayAttendance.absent],
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
        hoverBackgroundColor: ["#218838", "#e0a800", "#c82333"],
      },
    ],
  };

  return (
    <>
      <AdminNavbar />
      <Header />
      <Container className="mt--7" fluid>
        <div ref={dashboardRef}>
          <Row>
            <Col xl="6" className="mb-4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <h6 className="text-uppercase text-muted mb-1">Today's Attendance</h6>
                  <h3 className="mb-0">Hourly Attendance Breakdown</h3>
                </CardHeader>
                <CardBody>
                  <Line data={hourlyAttendance} />
                </CardBody>
              </Card>
            </Col>

            <Col xl="6" className="mb-4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <h6 className="text-uppercase text-muted mb-1">Attendance Trend</h6>
                  <h3 className="mb-0">Weekly Attendance Trend</h3>
                </CardHeader>
                <CardBody>
                  <Line data={attendanceTrends} />
                </CardBody>
              </Card>
            </Col>

            <Col xl="6" className="mb-4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <h6 className="text-uppercase text-muted mb-1">Today's Attendance Breakdown</h6>
                  <h3 className="mb-0">Attendance Distribution</h3>
                </CardHeader>
                <CardBody>
                  <Pie data={pieChartData} />
                </CardBody>
              </Card>
            </Col>

            <Col xl="6" className="mb-4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <h6 className="text-uppercase text-muted mb-1">Top Employees</h6>
                  <h3 className="mb-0">Leaderboard</h3>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="thead-light">
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Performance Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((employee) => (
                        <tr key={employee.employeeId}>
                          <td>{employee.employeeId}</td>
                          <td>{employee.name}</td>
                          <td>{employee.performanceScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        <Button color="primary" onClick={downloadPDF}>
          Export as PDF
        </Button>
      </Container>
    </>
  );
};

export default Dashboard;
