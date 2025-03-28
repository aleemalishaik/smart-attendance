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
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import ManageUsers from "views/examples/ManageUsers.js";
import ManageAdmins from "views/examples/ManageAdmins.js";
import CapturePhoto from "views/examples/CapturePhoto";
import Dashboard from "views/Dashboard";

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
    icon: "ni ni-bullet-list-67 text-info",
    component: <AttendanceRecords />,
    layout: "/admin",
  },
  {
    path: "/manage-users",
    name: "Manage Users",
    icon: "ni ni-planet text-info",
    component: <ManageUsers />,
    layout: "/admin",
  },
  {
    path: "/manage-admins",
    name: "Manage Admins",
    icon: "ni ni-planet text-info",
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
    icon: "ni ni-settings-gear-65 text-info",
    component: <SystemSettings />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "Profile",
    icon: "ni ni-single-02 text-info",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/activity-logs",
    name: "Activity & Logs",
    icon: "ni ni-archive-2 text-info",
    component: <ActivityLogs />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-info",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
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
