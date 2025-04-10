/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Profile from "views/examples/Profile.js";
import FaceTraining from "views/examples/FaceTraining.js"; // New Component
import AttendanceRecords from "views/examples/AttendanceRecords.js"; // New Component
import SystemSettings from "views/examples/SystemSettings.js"; // New Component
import ActivityLogs from "views/examples/ActivityLogs.js"; // New Component
// import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import ManageUsers from "views/examples/ManageUsers.js";
import ManageAdmins from "views/examples/ManageAdmins.js";
import CapturePhoto from "views/examples/CapturePhoto";
import Dashboard from "views/Dashboard";
import UserStats from "views/examples/UserStats"; // ✅ Add this import


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-info",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/attendance-records",
    name: "Attendance Records",
    icon: "fas fa-list-alt text-info",
    component: <AttendanceRecords />,
    layout: "/admin",
  },
  {
    path: "/manage-users",
    name: "Manage Users",
    icon: "fas fa-user-cog text-info",
    component: <ManageUsers />,
    layout: "/admin",
  },
  {
    path: "/manage-admins",
    name: "Manage Admins",
    icon: "fas fa-user-shield text-info",
    component: <ManageAdmins />,
    layout: "/admin",
  },
  {
    path: "/face-training",
    name: "Face Training & Recognition",
    icon: "ni ni-camera-compact text-info",
    component: <FaceTraining />,
    layout: "/admin",
  },
  {
    path: "/system-settings",
    name: "System Settings",
    icon: "fas fa-sliders-h text-info",
    component: <SystemSettings />,
    layout: "/admin",
  },
 
  {
    path: "/activity-logs",
    name: "Activity & Logs",
    icon: "fas fa-history text-info",
    component: <ActivityLogs />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "fas fa-columns text-info",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/user-stats/:employeeId",
    name: "User Stats",
    icon: "ni ni-chart-bar-32 text-info",
    component: <UserStats />,
    layout: "/admin", // ✅ Ensure it's inside Admin Layout
    invisible: true, // Hide from sidebar
  },

  {
    path: "/user-profile",
    name: "Profile",
    icon: "fas fa-user-tie text-info",
    component: <Profile />,
    layout: "/admin",
  },
  
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
    invisible:true,
  },
  {
    path: "/Scanning",
    name: "Scanning",
    icon: "ni ni-circle-08 text-info",
    component: <CapturePhoto />,
    layout: "/auth",
  },
];

export default routes;
