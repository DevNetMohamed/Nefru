# Admin Module Security & Bug Audit Report

**Date:** August 17, 2026  
**Module:** Admin Portal (Frontend & Backend APIs)  
**Status:** Completed

---

## 📌 Executive Summary

This report provides an in-depth security and functional assessment of the Admin features in the **NEFRU** platform. The audit identified **4 Critical/High Security Flaws** (including missing authentication and authorization middleware on admin endpoints, password hash leakage, and unprotected frontend routes) as well as **7 Functional Bugs / Runtime Crashes** across the frontend pages and backend controllers.

---

## 📊 Summary Findings Table

| ID | Issue Title | Layer | Severity | Status |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Unprotected Admin API Routes (Missing Auth & Role Checks) | Backend | 🔴 Critical | Open |
| **SEC-02** | Unprotected Frontend Admin Route (`/admin`) | Frontend | 🔴 Critical | Open |
| **SEC-03** | Sensitive Data Exposure (Password Hash Leakage) | Backend | 🟠 High | Open |
| **SEC-04** | Operator Precedence Logic Flaw in Guide/Tour Verification | Backend | 🟠 High | Open |
| **BUG-01** | Dashboard Crash on Zero / Empty Paid Bookings | Backend | 🔴 Critical | Open |
| **BUG-02** | Accounts Table Crash on `data.fullName.split()` | Frontend | 🔴 Critical | Open |
| **BUG-03** | CMS Page ReferenceError (`setAccountTypes`) | Frontend | 🔴 Critical | Open |
| **BUG-04** | Chart Crash in DoughnutChart (`dataSet.values.map`) | Frontend | 🟡 Medium | Open |
| **BUG-05** | Sidebar Navigation 404 Routing Bug | Frontend | 🟡 Medium | Open |
| **BUG-06** | Ban/Unban Status Mismatch (`isActive` vs `status`) | Backend | 🟡 Medium | Open |
| **BUG-07** | Hardcoded Stubs & Duplicated Booking/Analytics Views | Frontend | 🟢 Low | Open |

---

## 🚨 1. Security Vulnerabilities & Access Control Issues

### 🔴 SEC-01: Unprotected Admin API Routes (Broken Access Control / BOLA)
- **Location:** `backend/src/routes/admin.routes.js`
- **Description:**  
  The admin routes (`/api/admin/*`) are mounted without applying any authentication (`protect`) or role-verification (`restrictTo('admin')`) middleware.
- **Impact:**  
  Any unauthenticated guest or regular tourist/guide can issue requests to:
  - `GET /api/admin/dashboard` — View platform business metrics & revenue
  - `GET /api/admin/user` — Read all user profiles
  - `PATCH /api/admin/user/:id/ban` — Ban any user
  - `DELETE /api/admin/user/:id` — Delete user accounts
  - `PATCH /api/admin/guide/:id/approve` — Force-approve guide applications
- **Remediation:**
  Implement role-based authorization middleware in `backend/src/middlewares/authMiddleware.js`:
  ```javascript
  export const restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action",
        });
      }
      next();
    };
  };
  ```
  Protect all admin routes in `backend/src/routes/admin.routes.js`:
  ```javascript
  import { protect, restrictTo } from "../middlewares/authMiddleware.js";

  // Apply to all admin endpoints
  router.use(protect, restrictTo("admin"));
  ```

---

### 🔴 SEC-02: Unprotected Frontend Admin Route (`/admin`)
- **Location:** `frontend/src/routes/routes.jsx` (Lines 180–211)
- **Description:**  
  The `<ProtectedRoute allowedRoles={["admin"]} />` wrapper around the `/admin` path is commented out, leaving `<Admin />` directly accessible.
- **Impact:**  
  Any user can type `/admin/overview` or `/admin/accounts` in the browser URL and access administrative UI views.
- **Remediation:**
  Uncomment and enforce `ProtectedRoute` in `frontend/src/routes/routes.jsx`:
  ```javascript
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
  ```

---

### 🟠 SEC-03: Sensitive Data Exposure (Password Hash Leakage)
- **Location:**  
  - `backend/src/models/user.model.js` (Line 14)
  - `backend/src/controllers/Admin/Admin.controller.js` (Lines 25, 63, 135)
- **Description:**  
  The `password` field in `userSchema` does not have `select: false`. When admin queries `User.find()` or `User.findById()`, the password bcrypt hashes are returned in the response payload.
- **Impact:**  
  Bcrypt hashes of all system accounts (including administrators and guides) are sent across the network and exposed to client inspector.
- **Remediation:**
  1. Add `select: false` to `password` in `backend/src/models/user.model.js`:
     ```javascript
     password: {
       type: String,
       required: [true, "Password is required"],
       minlength: [6, "Password must be at least 6 characters"],
       select: false,
     },
     ```
  2. Exclude password in admin queries explicitly:
     ```javascript
     User.find({ role }).select("-password");
     ```

---

### 🟠 SEC-04: Operator Precedence Bypass in Guide & Tour Actions
- **Location:**  
  - `backend/src/controllers/Admin/Admin.controller.js` (Line 318 & Line 461)
- **Description:**  
  ```javascript
  if (!action in allowed) // ❌ Evaluates as (!action) in allowed -> false in allowed -> always false!
  ```
  In JavaScript, logical NOT (`!`) has higher operator precedence than `in`. `(!action)` evaluates to `false`, and `false in allowed` is always `false`. The validation condition is never met.
- **Impact:**  
  Any invalid action bypasses the validation check.
- **Remediation:**
  Wrap with parentheses or check property directly:
  ```javascript
  if (!(action in allowed)) {
    return res.status(400).json({
      success: false,
      message: "Action is invalid",
    });
  }
  ```

---

## 🐛 2. Functional Bugs & Runtime Crashes

### 🔴 BUG-01: Server Crash on Empty Paid Bookings
- **Location:** `backend/src/controllers/Admin/services.js` (Line 45)
- **Problem:**
  ```javascript
  const { totalPrice } = paidBookings[0];
  ```
  When there are 0 paid bookings matching `{ status: "confirmed", paymentStatus: "paid" }`, `paidBookings` is an empty array `[]`. Attempting to destructure index `0` throws:
  `TypeError: Cannot destructure property 'totalPrice' of 'paidBookings[0]' as it is undefined.`
- **Consequence:**  
  The controller crashes into its error handler, returning an unexpected fallback schema and breaking the frontend dashboard.
- **Remediation:**
  ```javascript
  const totalPrice = paidBookings[0]?.totalPrice || 0;
  ```

---

### 🔴 BUG-02: Accounts Table Crash on `data.fullName.split()`
- **Location:**  
  - `frontend/src/pages/Admin/components/Table/Table.jsx` (Lines 224, 227)
  - `backend/src/controllers/Admin/Admin.controller.js` (Line 63)
- **Problem:**  
  `AccountItem` assumes `data.fullName` exists and executes:
  ```javascript
  <p>{data.fullName.split(" ").map(word => word[0]).join("")}</p>
  ```
  However, the `User` model stores names inside the referenced `profileId` (`TouristProfile` or `GuideProfile`), and `Admin.controller.js` queries `User.find()` without `.populate("profileId")`. Thus `data.fullName` is `undefined`.
- **Consequence:**  
  When an account without an avatar is rendered, React crashes with `TypeError: Cannot read properties of undefined (reading 'split')`.
- **Remediation:**
  1. Backend: Populate `profileId` in `getAllUsers`:
     ```javascript
     User.find({ role }).populate("profileId").select("-password");
     ```
  2. Frontend: Safely derive name with fallback in `Table.jsx`:
     ```javascript
     const displayName = data.profileId?.fullName || data.fullName || data.email?.split("@")[0] || "User";
     ```

---

### 🔴 BUG-03: ReferenceError in Admin CMS Page
- **Location:** `frontend/src/pages/Admin/pages/CMS/CMS.jsx` (Line 48)
- **Problem:**  
  Line 48 calls `setAccountTypes(data.meta.types)` while `setAccountTypes` was commented out at line 23.
- **Consequence:**  
  Navigating to `/admin/cms` triggers `ReferenceError: setAccountTypes is not defined` whenever trips load.
- **Remediation:**  
  Remove the invalid `setAccountTypes` call or define the proper state variable for tour categories.

---

### 🟡 BUG-04: DoughnutChart Crash on Undefined Dataset
- **Location:** `frontend/src/pages/Admin/components/charts/charts.jsx` (Line 52)
- **Problem:**  
  `dataSet.values.map(...)` without null-safe optional chaining.
- **Consequence:**  
  If the dashboard data is loading or missing `values`, the chart throws an unhandled error.
- **Remediation:**
  ```javascript
  {dataSet?.values?.map((item, index) => (
    <p key={index} style={{ color: "#797979", fontSize: "14px" }}>{item}</p>
  ))}
  ```

---

### 🟡 BUG-05: Sidebar Navigation 404 Routing Bug
- **Location:** `frontend/src/pages/Admin/components/Sidebar/Sidebar.jsx` (Line 18)
- **Problem:**  
  `navigate(page.toLowerCase())` performs relative navigation. If the user is at `/admin/accounts` and clicks "Dashboard" (`overview`), the app navigates to `/admin/accounts/overview` (404 Page Not Found).
- **Remediation:**
  Use absolute paths for admin sub-routes:
  ```javascript
  function handleSelect(page = "") {
    navigate(`/admin/${page.toLowerCase()}`);
    setActive(page);
  }
  ```

---

### 🟡 BUG-06: Status Field Discrepancy on User Ban/Unban
- **Location:** `backend/src/controllers/Admin/Admin.controller.js` (Lines 215, 250)
- **Problem:**  
  `banUserById` executes `findByIdAndUpdate(userId, { isActive: false })`, but `user.model.js` uses `status: { enum: ["active", "suspended", "deactivated"] }`.
- **Consequence:**  
  The user is not actually suspended in accordance with the User model schema.
- **Remediation:**
  Update the `status` field:
  - Ban: `User.findByIdAndUpdate(userId, { status: "suspended" }, { new: true })`
  - Unban: `User.findByIdAndUpdate(userId, { status: "active" }, { new: true })`

---

### 🟢 BUG-07: Incomplete Pages & Hardcoded Stubs
- **Location:**
  - `frontend/src/pages/Admin/pages/Booking/Booking.jsx`: Contains a cloned copy of Accounts page and calls `getAccount()` instead of booking endpoints.
  - `frontend/src/pages/Admin/pages/Analytics/Analytics.jsx`: Static stub containing only `<p>Analytics</p>`.
  - `frontend/src/pages/Admin/pages/CMS/CMS.jsx`: Selected row details pane contains hardcoded mock data ("Sarah Mahmoud", "sarah.m@example.com") rather than the selected trip details.

---

## 🛠️ Step-by-Step Fix Implementation Plan

1. **Backend Access Control**: Add `restrictTo` in `authMiddleware.js` and apply `protect, restrictTo('admin')` in `admin.routes.js`.
2. **Password Security**: Add `select: false` to `password` in `user.model.js` and use `.select('-password')` in `Admin.controller.js`.
3. **Bug Fixes (Backend)**: Fix `paidBookings[0]` fallback in `services.js`, fix `!(action in allowed)` operator syntax, and populate `profileId`.
4. **Frontend Route Protection**: Protect `/admin` route in `routes.jsx` with `ProtectedRoute`.
5. **Bug Fixes (Frontend)**: Fix sidebar navigation links, fix `CMS.jsx` ReferenceError, add null guards in `charts.jsx` and `Table.jsx`.
