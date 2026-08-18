# NEFRU - Tourist & Trip Guide Platform

NEFRU is a full-stack application designed to connect tourists with professional tour guides in Egypt. Tourists can discover unique trips, view detailed itineraries, and book guides for personalized experiences.

## Core Features
- **Discovery:** Browse trips by category, location, or guide.
- **Booking:** Securely book tour guides for specific dates and trips.
- **Profiles:** Dedicated profiles for Tourists (bookings/history) and Guides (listings/ratings).
- **Details:** Comprehensive trip information including itineraries, pricing, and guide expertise.

## Project Structure

### Backend (`/backend`)
Built with Node.js, Express, and MongoDB.
- `src/models`: Data schemas for Users, Guides, Trips, and Bookings.
- `src/services`: Business logic layer (Trip management, Booking processing).
- `src/controllers`: Request handling and response formatting.
- `src/routes`: API endpoint definitions.
- `src/middlewares`: Authentication, Authorization, and Error handling.

### Frontend (`/frontend`)
Built with React, Vite, and CSS Modules.
- `src/pages`: Main views (Home, Auth, Trip Details, User/Guide Dashboards).
- `src/components`: Reusable UI elements (Cards, Navbars, Buttons).
- `src/assets`: Visual assets including Egyptian landmarks and guide profiles.

## Tech Stack
- **Frontend:** React 19, Vite, React Router 7, Bootstrap.
- **Backend:** Node.js, Express, Mongoose (MongoDB).
- **Auth:** JWT (Planned).

## Getting Started

1. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
