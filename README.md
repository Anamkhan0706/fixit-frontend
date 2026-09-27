# FixIt — Full-Stack Home Services Platform

FixIt is a full-stack local home-services booking platform that connects customers with service professionals such as electricians, plumbers, cleaners, and other local service providers.

The project was developed in stages. The frontend was initially developed as a React/Vite application, and during Week 4 it was integrated with the Node.js/Express backend and MongoDB database developed in Week 3.

The current application supports real API communication, authentication, professional discovery, professional details, booking creation, booking retrieval, booking cancellation, loading states, validation, error handling, and authenticated user interactions.

---

## Week 4 — Frontend and Backend Integration

The main objective of Week 4 was to integrate the React frontend with the backend REST APIs and create a functional full-stack application.

The frontend no longer depends on mock professional data for the main service-discovery and booking flows. It communicates with the backend using the browser Fetch API.

### Integration Flow

```text
Customer
   ↓
React Frontend
   ↓
Fetch API
   ↓
Express REST API
   ↓
Authentication / Validation / Authorization
   ↓
Mongoose
   ↓
MongoDB Atlas

For protected operations:

React Frontend
   ↓
JWT Token
   ↓
Authorization: Bearer <token>
   ↓
Express Authentication Middleware
   ↓
Controller
   ↓
MongoDB
Frontend and Backend Responsibilities
Frontend

The React frontend is responsible for:

User interface and responsive presentation
Client-side navigation using React Router
Form interaction and user input handling
Client-side validation
Loading states during API requests
Displaying user-friendly error messages
Communicating with backend APIs using the Fetch API
Fetching and displaying professional data
Fetching and displaying booking data
Managing authentication state on the client
Storing the JWT token for authenticated requests
Sending JWT tokens with protected API requests
Displaying booking status information
Providing customer feedback after successful or failed operations
Backend

The Node.js and Express backend is responsible for:

User authentication
JWT generation and verification
Role-based authorization
Request and input validation
MongoDB database operations through Mongoose
Booking creation, retrieval, update, and cancellation
Professional listing management
Professional ownership checks
Booking ownership checks
Centralized error handling
Secure password hashing using bcryptjs
Returning structured JSON API responses
Technology Stack
Frontend
React 19
Vite
React Router
Tailwind CSS
Lucide React
Browser Fetch API
JavaScript / JSX
Backend
Node.js
Express.js
MongoDB Atlas
Mongoose
JSON Web Tokens (JWT)
bcryptjs
express-validator
dotenv
CORS
Testing
Jest
Supertest
VS Code REST Client
Project Architecture

The project follows a separation-of-concerns architecture.

Frontend Architecture
React Application
│
├── Components
│   ├── Navbar
│   ├── Footer
│   ├── ProfessionalCard
│   ├── StarRating
│   └── StatusStepper
│
├── Pages
│   ├── Landing
│   ├── Login
│   ├── ProfessionalDetail
│   └── Dashboard
│
├── Context
│   └── AppContext
│
├── Data
│   └── mockData
│
└── API Communication
    └── Fetch API
Backend Architecture
Express Application
│
├── Routes
│   ├── Auth Routes
│   ├── Professional Routes
│   └── Booking Routes
│
├── Controllers
│   ├── Auth Controller
│   ├── Professional Controller
│   └── Booking Controller
│
├── Models
│   ├── User
│   ├── Professional
│   └── Booking
│
├── Middleware
│   ├── Authentication
│   ├── Validation
│   └── Error Handling
│
└── Database
    └── MongoDB Atlas

This structure keeps UI logic, API communication, business logic, database logic, validation, and authentication responsibilities separated.

Frontend Project Structure
fixit-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProfessionalCard.jsx
│   │   ├── StarRating.jsx
│   │   └── StatusStepper.jsx
│   │
│   ├── context/
│   │   └── AppContext.jsx
│   │
│   ├── data/
│   │   └── mockData.js
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   └── ProfessionalDetail.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
Backend Project Structure
fixit-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── professionalController.js
│   │   └── bookingController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Professional.js
│   │   └── Booking.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── professionalRoutes.js
│   │   └── bookingRoutes.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── auth.test.js
│   ├── bookings.test.js
│   ├── professionals.test.js
│   └── helpers/
│       └── db.js
│
├── docs/
│   └── API.md
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── test-api.http
API Integration

The frontend communicates with the backend through the following environment variable:

VITE_API_URL=http://localhost:5000/api

The frontend uses:

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

This allows the API base URL to be configured without hard-coding the backend address throughout the application.

Authentication Integration

The authentication flow connects the React login page with the backend authentication API.

Login Flow
User enters email and password
        ↓
React Login Page
        ↓
POST /api/auth/login
        ↓
Express Authentication Controller
        ↓
User lookup in MongoDB
        ↓
Password verification using bcryptjs
        ↓
JWT generated
        ↓
Token returned to frontend
        ↓
Token stored in localStorage
        ↓
User redirected to Dashboard

The frontend stores:

fixit_token
fixit_user

The JWT is then included in authenticated API requests:

Authorization: Bearer <JWT_TOKEN>

The backend verifies the token before allowing protected operations.

Professional Integration

The landing page retrieves professionals from the backend instead of relying on hard-coded professional records for the main browsing flow.

Get Professionals
GET /api/professionals

The frontend requests the data and displays:

Professional name
Service category
Description
Location
Rating
Price
Availability

The frontend maps backend MongoDB _id values to the UI professional ID so that each professional can be opened through its detail page.

Professional Detail Integration

When a customer selects a professional, the frontend requests the individual professional record.

GET /api/professionals/:id

The Professional Detail page displays backend data and provides the booking form.

The page includes:

Professional information
Service information
Location
Rating
Price
Availability
Booking date
Booking time
Service address
Issue description

The page also displays loading and error states while communicating with the backend.

Booking Integration

Bookings are created through the backend API.

POST /api/bookings

The booking request is sent from the React application after the customer submits the booking form.

The request includes information such as:

Professional
Service
Date
Time
Address
Issue

The backend validates the request, verifies authentication, checks the referenced records, and stores the booking in MongoDB.

Booking Retrieval

Authenticated customers can retrieve their bookings using:

GET /api/bookings

The frontend sends the JWT token with the request.

The Dashboard displays backend booking records including:

Booking ID
Professional
Service
Date
Time
Address
Issue
Booking status

The Dashboard uses the backend response as the main source for displaying current bookings.

Booking Cancellation

Customers can cancel a booking using:

DELETE /api/bookings/:id

The frontend sends the authenticated request.

After cancellation, the Dashboard refreshes the booking data from the backend so that the UI reflects the latest server state.

Booking Status Integration

The backend uses these booking statuses:

pending
confirmed
completed
cancelled

The frontend maps backend statuses to user-friendly labels:

pending    → Requested
confirmed  → Accepted
completed  → Completed
cancelled  → Cancelled

The StatusStepper component visually represents the current booking state.

This mapping allows the backend to maintain consistent database values while the frontend displays customer-friendly terminology.

State Management

The application uses React state and context for frontend state management.

The AppContext manages booking-related actions and application-level data.

Important state includes:

Booking information
Loading state
Error state
Authentication-related local storage values

For API operations, components maintain appropriate loading and error states.

Example flow:

User Action
    ↓
Set loading = true
    ↓
Send API request
    ↓
Receive response
    ↓
Update React state
    ↓
Display result
    ↓
Set loading = false

This prevents the interface from appearing unresponsive during asynchronous operations.

Error Handling

The application handles errors at both frontend and backend levels.

Frontend

The frontend checks the HTTP response and displays meaningful messages when requests fail.

Examples include:

Invalid login credentials
Failed professional loading
Failed booking creation
Failed booking retrieval
Failed cancellation
Missing authentication token
Validation errors

Loading and retry states are also provided where appropriate.

Backend

The backend uses:

Request validation
HTTP status codes
Controller-level error handling
Centralized error middleware
MongoDB/Mongoose validation
Invalid ObjectId handling
Authentication checks
Authorization checks

Common response codes include:

200 - Successful request
201 - Resource created
400 - Invalid request
401 - Authentication required or invalid
403 - Access denied
404 - Resource not found
500 - Server error
Validation

Frontend validation is used to provide immediate feedback to users before API requests are sent.

Examples include:

Required fields
Email validation
Password validation
Booking date validation
Booking time validation
Address validation
Issue description validation

The backend also validates incoming data using express-validator and Mongoose schema validation.

Backend validation is treated as the final security and data-integrity layer because client-side validation can be bypassed.

Security

Several security practices were implemented.

Password Security

Passwords are hashed using bcryptjs before being stored in MongoDB.

Plain-text passwords are not stored in the database.

JWT Authentication

JWT tokens are used to authenticate protected requests.

Protected endpoints verify the token before processing requests.

Authorization

Role-based access control is implemented for protected professional operations.

Ownership checks are also used to prevent users from modifying resources that do not belong to them.

Environment Variables

Sensitive configuration values are stored in .env.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

The .env file is excluded from Git using .gitignore.

Only .env.example is included for configuration reference.

Registration Security

The registration endpoint does not allow a customer to freely assign a privileged role through the request body.

Database Validation

Mongoose schemas validate important fields before data is stored.

API Endpoints
Authentication
Method	Endpoint	Purpose
POST	/api/auth/register	Register a user
POST	/api/auth/login	Authenticate a user and return JWT
Professionals
Method	Endpoint	Purpose
GET	/api/professionals	Get all professionals
GET	/api/professionals/:id	Get one professional
POST	/api/professionals	Create a professional
PUT	/api/professionals/:id	Update a professional
DELETE	/api/professionals/:id	Delete a professional
Bookings
Method	Endpoint	Purpose
POST	/api/bookings	Create a booking
GET	/api/bookings	Get authenticated user's bookings
GET	/api/bookings/:id	Get one booking
PUT	/api/bookings/:id	Update a booking
DELETE	/api/bookings/:id	Cancel/delete a booking
Local Setup

The project uses separate frontend and backend applications.

Both applications must be running for the complete full-stack application to work.

Backend Setup

Navigate to the backend project:

cd C:\Users\syedu\OneDrive\Desktop\fixit-backend

Install dependencies:

npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start the backend:

npm start

For development:

npm run dev

The backend runs on:

http://localhost:5000

Health endpoint:

http://localhost:5000/api/health
Frontend Setup

The actual frontend Vite project is located inside the Week 2 wrapper folder.

Navigate to:

cd C:\Users\syedu\OneDrive\Desktop\FixIt_Week2_Frontend\fixit-frontend

Install dependencies:

npm install

Create a .env file:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev

Vite will provide the local frontend address, normally:

http://localhost:5173
Running the Full Application

Start the backend first:

cd C:\Users\syedu\OneDrive\Desktop\fixit-backend
npm run dev

Then open another terminal and start the frontend:

cd C:\Users\syedu\OneDrive\Desktop\FixIt_Week2_Frontend\fixit-frontend
npm run dev

Then open the frontend URL shown by Vite.

The application requires both servers to be running because:

Frontend → http://localhost:5173
Backend  → http://localhost:5000
Database → MongoDB Atlas
Testing
Backend Automated Testing

The backend uses Jest and Supertest.

Run:

npm test

The completed backend test suite contains:

3 test suites
25 tests
25 passed
0 failed

The tests cover authentication, professionals, bookings, validation, authorization, and protected operations.

Frontend Production Build

The frontend was tested using the production build command:

npm run build

The build completed successfully.

The Vite production build generated the dist directory without build errors.

Manual Full-Stack Integration Test

The complete customer flow was manually tested through the browser.

Test Flow
1. Open FixIt frontend
        ↓
2. Backend professionals appear on landing page
        ↓
3. Select a professional
        ↓
4. Professional details are loaded from backend
        ↓
5. Log in with a registered customer account
        ↓
6. JWT is stored in the browser
        ↓
7. Create a booking
        ↓
8. Booking is saved in MongoDB
        ↓
9. Dashboard retrieves booking from backend
        ↓
10. Booking status is displayed
        ↓
11. Cancel booking
        ↓
12. Dashboard refreshes from backend
        ↓
13. Booking is removed/cancelled
        ↓
14. Log out
        ↓
15. User is returned to Login

This confirmed that the major frontend-to-backend integration points work together.

Challenges and Solutions
Challenge 1 — Frontend initially displayed a blank page

The frontend initially produced an invalid React hook error.

The issue was traced to an additional nested src/node_modules directory, which caused React dependencies to be resolved incorrectly.

The nested dependency directory was removed and the Vite cache was cleared.

After restarting the development server, the application loaded correctly.

Challenge 2 — Frontend professional data used a different data structure

The original frontend was designed around mock professional objects, while the backend returned MongoDB professional documents.

The solution was to map backend fields into the structure expected by the existing UI components.

For example:

Backend _id
      ↓
Frontend professional id

Backend service
      ↓
Frontend categoryLabel

Backend price
      ↓
Frontend hourlyRate

This allowed the existing UI components to continue working while using real backend data.

Challenge 3 — Booking data structure mismatch

The original Dashboard expected frontend mock booking data.

The backend returned MongoDB booking objects containing fields such as:

_id
professional
service
date
time
address
issue
status

The Dashboard was updated to consume the actual backend structure.

Challenge 4 — Booking status terminology

The backend uses:

pending
confirmed
completed
cancelled

while the original frontend displayed:

Requested
Accepted
In Progress
Completed

A status mapping was added so that backend values could be displayed using user-friendly frontend labels.

Challenge 5 — Authentication state in navigation

The Navbar originally displayed a login option without checking the actual backend authentication state.

It was updated to check for the JWT token stored in localStorage.

When authenticated:

Log Out

is displayed.

When logged out:

Log In

is displayed.

Logging out removes the stored authentication information and redirects the user to the login page.

Performance and Integration Practices

The application follows several full-stack development practices:

API base URL is configurable through environment variables
API requests are asynchronous
Loading states prevent confusing UI during requests
Error states provide feedback when API calls fail
Backend validation protects data integrity
Authentication is enforced on protected endpoints
Authorization checks prevent unauthorized operations
Database access is separated into models/controllers
Frontend UI components remain reusable
API communication is separated from presentation concerns
Sensitive environment configuration is excluded from Git
Production frontend builds are verified before submission
API Documentation

Detailed backend API documentation is available in:

fixit-backend/docs/API.md

The backend repository also contains:

test-api.http

which can be used with the VS Code REST Client extension for manual API testing.

GitHub Repositories
Frontend

https://github.com/Anamkhan0706/fixit-frontend

Backend

https://github.com/Anamkhan0706/fixit-backend

Environment Configuration

The frontend uses:

VITE_API_URL=http://localhost:5000/api

The backend uses:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Actual credentials and secrets should never be committed to GitHub.

Current Integration Status

The Week 4 integration includes:

React frontend connected to Express backend
MongoDB Atlas database connection
Real professional data retrieval
Real professional detail retrieval
Real customer authentication
JWT-based authentication
Protected booking APIs
Booking creation
Booking retrieval
Booking cancellation
Booking status display
Client-side validation
Backend validation
Loading states
Error handling
Authentication-aware navigation
Logout functionality
Automated backend testing
Manual frontend integration testing
Successful frontend production build
Week 4 Deliverable

The Week 4 deliverable consists of the integrated frontend and backend source code.

The project can be run locally by starting both:

FixIt Backend
http://localhost:5000

and

FixIt Frontend
http://localhost:5173

The application uses MongoDB Atlas as the database.

A public deployment is not currently provided; the completed integration was demonstrated and tested locally.

Week 4 Completion Summary

The FixIt frontend and backend have been integrated into a functional full-stack application.

The React frontend communicates with the Express REST API using asynchronous Fetch requests. Authentication is handled through JWT-based login, and protected requests include the JWT token in the Authorization header.

Professional data is retrieved from MongoDB through the backend and displayed dynamically in the frontend. Customers can open professional details, submit booking requests, view their bookings, and cancel bookings.

The Dashboard retrieves current booking information from the backend and maps backend booking statuses into user-friendly UI states. Loading and error states have been implemented to provide feedback during asynchronous operations.

The backend provides validation, authentication, authorization, database operations, ownership checks, password hashing, and centralized error handling.

The backend automated test suite contains 25 passing tests, and the frontend production build completes successfully.

The project is organized into separate frontend and backend repositories with documented setup instructions and API documentation.

Conclusion

Week 4 successfully connected the FixIt React frontend with the Node.js/Express backend developed in Week 3.

The application now demonstrates a complete frontend-to-backend data flow:

User Interaction
      ↓
React Frontend
      ↓
Fetch API
      ↓
Express REST API
      ↓
Authentication / Validation
      ↓
Controllers
      ↓
Mongoose
      ↓
MongoDB Atlas
      ↓
API Response
      ↓
React State
      ↓
Updated User Interface

This integration transforms the FixIt project from a frontend prototype into a functional full-stack home-services booking application with real database communication, authentication, API-driven data, booking management, validation, error handling, and testing.