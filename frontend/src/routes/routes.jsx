import { createBrowserRouter } from "react-router-dom";
// DONT DELETE THIS COMMENT, IT'S IMPORTANT

// لما نخلص المشروع شيل الcomment اللي تحت
// ولف الRouterProvider بالProtectedRoute وحدد الallowedRoles حسب كل route
// عشان يسهل  الشغل علينا
// import ProtectedRoute from "./ProtectedRoute";

import AuthLayout from "../shared/AuthLayout/AuthLayout";
import MasterLayout from "../shared/MasterLayout/MasterLayout";
import NotFound from "../shared/NotFound/NotFound";
// Auth Pages
import Welcome from "../pages/Auth/Welcome/Welcome";
import Login from "../pages/Auth/components/Login/Login";
import Register from "../pages/Auth/components/Register/Register";
import Forgetpassword from "../pages/Auth/components/Forgetpassword/Forgetpassword";
import ResetPassword from "../pages/Auth/components/ResetPassword/ResetPassword";
import ApplicationReceived from "../pages/Auth/components/ApplicationReceived/ApplicationReceived";
// User Pages
import Home from "../pages/User/Home/Home";
import Trips from "../pages/User/Trips/Trips";
import Info from "../pages/User/Trips/Info/Info";
import Book from "../pages/User/Trips/Book/Book";
import Status from "../pages/User/Trips/Book/components/Status/Status";
import Guide from "../pages/User/Trips/Guide/Guide";
import Saved from "../pages/User/Saved/Saved";
import Profile from "../pages/User/Profile/Profile";
import Settings from "../pages/User/Settings/Settings";

//Tourist Discover Page
import Discover from "../pages/User/Discover/Discover";

import Admin from "../pages/Admin/Admin";
import DashboardStatus from "../pages/Admin/components/DashboardStatus/DashboardStatus";
import Accounts from "../pages/Admin/components/Accounts/Accounts";
import CMS from "../pages/Admin/components/CMS/CMS";
import Analytics from "../pages/Admin/components/Analytics/Analytics";
import Booking from "../pages/Admin/components/Booking/Booking";

// Guide Pages
import ToursManagement from "../pages/Guide/ToursManagement/ToursManagement";
import CreateTour from "../pages/Guide/CreateTour/CreateTour";
import Schedule from "../pages/Guide/Schedule/Schedule";
import TourMedia from "../pages/Guide/TourMedia/TourMedia";
import TourApprove from "../pages/Guide/TourApprove/TourApprove";
import GuideProfile from "../pages/Guide/GuideProfile/GuideProfile";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
    errorElement: <NotFound />,
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "application-received", element: <ApplicationReceived /> },
      { path: "forget-password", element: <Forgetpassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "user",
    element: <MasterLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "guideprofile", element: <GuideProfile /> },
      //Discover Routes
      { path: "discover", element: <Discover /> },

      {
        path: "trips",
        children: [
          { index: true, element: <Trips /> },
          { path: "info", element: <Info /> },
          { path: "book", element: <Book /> },
          { path: "book/status", element: <Status /> },
          { path: "guide", element: <Guide /> },
        ],
      },
      { path: "saved", element: <Saved /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
    ],

    // DONT DELETE THIS COMMENT, IT'S IMPORTANT

    //protected route for tourist and guide, we will protect after we finish the project
    // لما نخلص المشروع شيل الcomment اللي تحت

    // element: <ProtectedRoute allowedRoles={["tourist", "guide"]} />,
    // children: [
    //   {
    //     element: <MasterLayout />,
    //     children: [
    //       { index: true, element: <Home /> },
    //       { path: "home", element: <Home /> },

    //       //Discover Routes
    //       { path: "discover", element: <Discover /> },

    //       {
    //         path: "trips",
    //         children: [
    //           { index: true, element: <Trips /> },
    //           { path: "info", element: <Info /> },
    //           { path: "book", element: <Book /> },
    //           { path: "book/status", element: <Status /> },
    //           { path: "guide", element: <Guide /> },
    //         ],
    //       },
    //       { path: "saved", element: <Saved /> },
    //       { path: "profile", element: <Profile /> },
    //       { path: "settings", element: <Settings /> },
    //     ],
    //   },
    // ],

    // DONT DELETE THIS COMMENT, IT'S IMPORTANT
  },
 
 {
  path: "guide",
  children: [
    { index: true, element: <ToursManagement /> },
    { path: "createtour", element: <CreateTour /> },
    { path: "schedule", element: <Schedule /> },
    { path: "tourmedia", element: <TourMedia /> },
    { path: "tourapprove", element: <TourApprove /> },
  ],
},
  {
    path: "admin",

    // not protected yet, we will protect after we finish the project
    element: <Admin />,

    children: [
      { path: "overview", element: <DashboardStatus /> },
      { path: "accounts", element: <Accounts /> },
      { path: "cms", element: <CMS /> },
      { path: "analytics", element: <Analytics /> },
      { path: "booking", element: <Booking /> },
    ],
    // DONT DELETE THIS COMMENT, IT'S IMPORTANT

    //protected route for admin, we will protect after we finish the project
    // لما نخلص المشروع شيل الcomment اللي تحت
    // element: <ProtectedRoute allowedRoles={["admin"]} />,
    // children: [
    //   {
    //     element: <Admin />,
    //     children: [
    //       { path: "overview", element: <DashboardStatus /> },
    //       { path: "accounts", element: <Accounts /> },
    //       { path: "cms", element: <CMS /> },
    //       { path: "analytics", element: <Analytics /> },
    //       { path: "booking", element: <Booking /> },
    //     ],
    //   },
    // ],
    // DONT DELETE THIS COMMENT, IT'S IMPORTANT
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
