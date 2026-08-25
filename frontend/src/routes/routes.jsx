import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "../shared/AuthLayout/AuthLayout";
import MasterLayout from "../shared/MasterLayout/MasterLayout";
import NotFound from "../shared/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import RequireApprovedGuide from "./RequireApprovedGuide";

// Auth Pages
import Welcome from "../pages/Auth/Welcome/Welcome";
import Login from "../pages/Auth/components/Login/Login";
import Register from "../pages/Auth/components/Register/Register";
import Forgetpassword from "../pages/Auth/components/Forgetpassword/Forgetpassword";
import ResetPassword from "../pages/Auth/components/ResetPassword/ResetPassword";
import CheckEmail from "../pages/Auth/Onboarding/CheckEmail";
import VerifyEmail from "../pages/Auth/Onboarding/VerifyEmail";
import ChooseRole from "../pages/Auth/Onboarding/ChooseRole";
import LinkGoogleAccount from "../pages/Auth/Onboarding/LinkGoogleAccount";

// User Pages
import Home from "../pages/User/Home/Home";
import Trips from "../pages/User/Trips/Trips";
import Info from "../pages/User/Trips/Info/Info";
import Book from "../pages/User/Trips/Book/Book";
import Status from "../pages/User/Trips/Book/components/Status/Status";
import Saved from "../pages/User/Saved/Saved";
import Profile from "../pages/User/Profile/Profile";
import ProfileOverview from "../pages/User/Profile/pages/ProfileOverview/ProfileOverview";
import EditProfile from "../pages/User/Profile/pages/EditProfile/EditProfile";
import ChangePassword from "../pages/User/Profile/pages/ChangePassword/ChangePassword";
import MyBookings from "../pages/User/Profile/pages/MyBookings/MyBookings";
import PaymentMethods from "../pages/User/Profile/pages/PaymentMethods/PaymentMethods";
import ReviewsWritten from "../pages/User/Profile/pages/ReviewsWritten/ReviewsWritten";
import HelpSupport from "../pages/User/Profile/pages/HelpSupport/HelpSupport";
import Settings from "../pages/User/Settings/Settings";
import NotificationsPage from "../pages/User/Notifications/NotificationsPage";
import Discover from "../pages/User/Discover/Discover";
import NearbyMap from "../pages/User/NearbyMap/NearbyMap";
import RecommendedTrips from "../pages/User/RecommendedTrips/RecommendedTrips";
import AvailableTodayPage from "../pages/User/AvailableToday/AvailableTodayPage";
import DiscoverEgyptPage from "../pages/User/DiscoverEgypt/DiscoverEgyptPage";

// Admin
import Admin from "../pages/Admin/Admin";
import DashboardStatus from "../pages/Admin/pages/DashboardStatus/DashboardStatus";
import Accounts from "../pages/Admin/pages/Accounts/Accounts";
import CMS from "../pages/Admin/pages/CMS/CMS";
import Analytics from "../pages/Admin/pages/Analytics/Analytics";
import Booking from "../pages/Admin/pages/Booking/Booking";

// Guide Pages
import ToursManagement from "../pages/Guide/ToursManagement/ToursManagement";
import CreateTour from "../pages/Guide/CreateTour/CreateTour";
import Schedule from "../pages/Guide/Schedule/Schedule";
import TourMedia from "../pages/Guide/TourMedia/TourMedia";
import TourApprove from "../pages/Guide/TourApprove/TourApprove";
import GuideProfile from "../pages/Guide/GuideProfile/GuideProfile";
import GuidePortalLayout from "../pages/Guide/components/GuidePortalLayout/GuidePortalLayout";
import GuideDashboard from "../pages/Guide/GuideDashboard/GuideDashboard";
import GuideCalendar from "../pages/Guide/GuideCalendar/GuideCalendar";
import GuideAccountProfile from "../pages/Guide/GuideAccountProfile/GuideAccountProfile";
import GuideNotifications from "../pages/Guide/GuideNotifications/GuideNotifications";
import GuideVerification from "../pages/Guide/GuideVerification/GuideVerification";
import GuideApplicationReceived from "../pages/Guide/GuideApplicationReceived/GuideApplicationReceived";
import GuideBookings from "../pages/Guide/GuideBookings/GuideBookings";

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
      {
        path: "application-received",
        element: <Navigate to="/guide/application-received" replace />,
      },
      { path: "forget-password", element: <Forgetpassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "check-email", element: <CheckEmail /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "choose-role", element: <ChooseRole /> },
      { path: "link-google", element: <LinkGoogleAccount /> },
    ],
  },
  {
    path: "user",
    element: <MasterLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "guideprofile", element: <GuideProfile /> },
      { path: "discover", element: <Discover /> },
      { path: "nearby", element: <NearbyMap /> },
      { path: "recommended-trips", element: <RecommendedTrips /> },
      { path: "all-recommended-trips", element: <RecommendedTrips /> },
      { path: "available-today", element: <AvailableTodayPage /> },
      { path: "tours-available-today", element: <AvailableTodayPage /> },
      { path: "discover-egypt", element: <DiscoverEgyptPage /> },
      { path: "explore-egypt", element: <DiscoverEgyptPage /> },

      {
        path: "trips",
        children: [
          { index: true, element: <Trips /> },
          { path: "info", element: <Info /> },
          { path: "info/:id", element: <Info /> },
          {
            element: <ProtectedRoute allowedRoles={["tourist"]} />,
            children: [
              { path: ":id/book", element: <Book /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["tourist"]} />,
        children: [
          { path: "saved", element: <Navigate to="/user/profile/saved" replace /> },
          { path: "bookings/:bookingId/payment", element: <Status /> },
          {
            path: "profile",
            element: <Profile />,
            children: [
              { index: true, element: <ProfileOverview /> },
              { path: "edit", element: <EditProfile /> },
              { path: "change-password", element: <ChangePassword /> },
              { path: "bookings", element: <MyBookings /> },
              { path: "saved", element: <Saved /> },
              { path: "payments", element: <PaymentMethods /> },
              { path: "reviews", element: <ReviewsWritten /> },
              { path: "support", element: <HelpSupport /> },
            ],
          },
          { path: "settings", element: <Settings /> },
          { path: "notifications", element: <NotificationsPage /> },
        ],
      },
    ],
  },
  {
    path: "guide",
    element: <ProtectedRoute allowedRoles={["guide"]} />,
    children: [
      {
        element: <GuidePortalLayout />,
        children: [
          { index: true, element: <ToursManagement /> },
          { path: "dashboard", element: <GuideDashboard /> },
          { path: "calendar", element: <GuideCalendar /> },
          { path: "bookings", element: <GuideBookings /> },
          { path: "profile", element: <GuideAccountProfile /> },
          { path: "notifications", element: <GuideNotifications /> },
          { path: "verification", element: <GuideVerification /> },
          { path: "application-received", element: <GuideApplicationReceived /> },
        ],
      },
      {
        element: <RequireApprovedGuide />,
        children: [
          { path: "createtour", element: <CreateTour /> },
          { path: "schedule", element: <Schedule /> },
          { path: "tourmedia", element: <TourMedia /> },
          { path: "tourapprove", element: <TourApprove /> },
        ],
      },
    ],
  },
  {
    path: "admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <Admin />,
        children: [
          { index: true, element: <Navigate to="/admin/overview" replace /> },
          { path: "overview", element: <DashboardStatus /> },
          { path: "accounts", element: <Accounts /> },
          { path: "cms", element: <CMS /> },
          { path: "analytics", element: <Analytics /> },
          { path: "booking", element: <Booking /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
