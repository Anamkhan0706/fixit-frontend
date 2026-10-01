# FixIt — Full-Stack Home Services Platform

FixIt is a full-stack local home-services booking platform that connects customers with service professionals such as electricians, plumbers, cleaners, and other local service providers.

The application provides a React-based frontend connected to a Node.js/Express REST API and MongoDB Atlas database. Customers can browse service professionals, search and filter professionals, view professional details, authenticate using JWT-based login, create bookings, view their bookings, and cancel bookings.

The backend provides authentication, authorization, validation, CRUD operations, ownership checks, centralized error handling, and database interaction through Mongoose.

---

## Features

### Customer Features

- Browse available service professionals
- View professional name, service, description, rating, price, and location
- Search professionals by name or service information
- Filter professionals by service category
- Sort professionals by available sorting options
- View detailed professional profiles
- Submit service booking requests
- View authenticated user's bookings
- View booking status
- Cancel bookings
- Login and logout functionality
- Client-side form validation
- Loading and error states
- Responsive user interface

### Professional Features

- Professional accounts can be registered
- Authenticated professionals can create professional listings
- Professional ownership is checked before modifying or deleting listings
- Professional data is stored in MongoDB
- Professional listings are retrieved dynamically through REST APIs

### Backend Features

- RESTful API architecture
- JWT authentication
- Role-based authorization
- Password hashing with bcryptjs
- MongoDB Atlas database
- Mongoose schemas and validation
- CRUD operations
- Request validation with express-validator
- ObjectId validation
- Ownership checks
- Centralized error handling
- Environment-variable configuration
- CORS configuration
- Automated API testing with Jest and Supertest

---

## Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Lucide React
- JavaScript / JSX
- Browser Fetch API

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- express-validator
- dotenv
- CORS

### Testing

- Jest
- Supertest
- VS Code REST Client
- Manual browser-based integration testing

---

## System Architecture

The application follows a separation-of-concerns architecture.

```text
                         FIXIT FULL-STACK APPLICATION

┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│                                                             │
│  Pages       Components       Context       Fetch API        │
│  Landing     Navbar           AppContext    HTTP Requests   │
│  Login       ProfessionalCard                                │
│  Detail      StatusStepper                                   │
│  Dashboard   Footer                                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP / JSON
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express REST API                         │
│                                                             │
│  Routes → Middleware → Controllers → Models                 │
│                                                             │
│  Authentication                                             │
│  Authorization                                              │
│  Validation                                                 │
│  Error Handling                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Mongoose
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Atlas                           │
│                                                             │
│  Users                                                      │
│  Professionals                                              │
│  Bookings                                                   │
└─────────────────────────────────────────────────────────────┘
```

### Protected Request Flow

```text
React Frontend
      ↓
User Login
      ↓
POST /api/auth/login
      ↓
Express Authentication
      ↓
JWT Generated
      ↓
JWT Stored on Client
      ↓
Protected API Request
      ↓
Authorization: Bearer <JWT>
      ↓
Authentication Middleware
      ↓
Role / Ownership Checks
      ↓
Controller
      ↓
Mongoose
      ↓
MongoDB Atlas
      ↓
JSON Response
      ↓
React UI Update
```

---

## Frontend Architecture

The frontend is organized using React components, pages, shared context, and reusable UI elements.

```text
fixit-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProfessionalCard.jsx
│   │   ├── StarRating.jsx
│   │   └── StatusStepper.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   └── ProfessionalDetail.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

### Frontend Responsibilities

The React frontend is responsible for:

- Rendering the user interface
- Client-side navigation
- Displaying API data
- Handling user input
- Client-side validation
- Sending asynchronous API requests
- Managing loading states
- Managing error states
- Managing authentication state
- Storing the JWT token on the client
- Sending JWT tokens with protected requests
- Displaying booking information
- Displaying booking status
- Updating the UI after successful operations
- Providing responsive layouts for different screen sizes

---

## Backend Architecture

The backend follows a controller-based structure with separate routes, models, middleware, and configuration.

```text
fixit-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── professionalController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Professional.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── professionalRoutes.js
│   │   └── bookingRoutes.js
│   ├── app.js
│   └── server.js
├── tests/
├── docs/
│   └── API.md
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Separation of Concerns

The backend separates responsibilities into different layers:

**Routes**

Define API endpoints and connect requests to middleware and controllers.

**Middleware**

Handles authentication, authorization, validation, and error processing.

**Controllers**

Contain application logic and coordinate database operations.

**Models**

Define MongoDB document structures and validation rules.

**Configuration**

Contains database and environment configuration.

This structure makes the application easier to maintain, test, debug, and extend.

---

## Database Design

MongoDB Atlas is used as the application's database.

### User Collection

The User model contains:

- `name`
- `email`
- `password`
- `role`
- `createdAt`
- `updatedAt`

Supported roles:

```text
customer
professional
admin
```

Passwords are hashed using bcryptjs before being stored.

---

### Professional Collection

The Professional model contains:

- `user`
- `name`
- `service`
- `description`
- `location`
- `rating`
- `price`
- `availability`
- `createdAt`
- `updatedAt`

The `user` field associates a professional listing with its owner.

---

### Booking Collection

The Booking model contains:

- `user`
- `professional`
- `service`
- `date`
- `time`
- `address`
- `issue`
- `status`
- `createdAt`
- `updatedAt`

Booking status values are:

```text
pending
confirmed
completed
cancelled
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate user and return JWT | Public |

### Professionals

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/professionals` | Get all professionals | Public |
| GET | `/api/professionals/:id` | Get one professional | Public |
| POST | `/api/professionals` | Create professional listing | Professional/Admin |
| PUT | `/api/professionals/:id` | Update professional listing | Owner/Admin |
| DELETE | `/api/professionals/:id` | Delete professional listing | Owner/Admin |

### Bookings

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/bookings` | Create a booking | Authenticated |
| GET | `/api/bookings` | Get authenticated user's bookings | Authenticated |
| GET | `/api/bookings/:id` | Get one booking | Authenticated |
| PUT | `/api/bookings/:id` | Update a booking | Authenticated |
| DELETE | `/api/bookings/:id` | Cancel/delete a booking | Authenticated |

---

## API Integration

The frontend communicates with the backend using the browser's native Fetch API.

The API base URL is configured through the Vite environment variable:

```text
VITE_API_URL=http://localhost:5000/api
```

Example request:

```javascript
const response = await fetch(`${API_URL}/professionals`);
const data = await response.json();
```

Protected requests include the JWT:

```javascript
const response = await fetch(`${API_URL}/bookings`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

This keeps the API URL configurable without hard-coding it throughout the application.

---

## Dynamic Professional Data

Professional listings are retrieved from the backend instead of being hard-coded into the main discovery flow.

The frontend requests:

```text
GET /api/professionals
```

The backend retrieves the records from MongoDB Atlas and returns structured JSON.

The frontend maps the backend response into the UI model used by `ProfessionalCard`.

For example:

```text
MongoDB
   ↓
Professional Model
   ↓
Professional Controller
   ↓
GET /api/professionals
   ↓
Landing.jsx
   ↓
ProfessionalCard.jsx
   ↓
User Interface
```

The application was manually verified with multiple professionals, including electrical and plumbing service providers.

---

## Search, Filtering, and Sorting

The landing page supports client-side discovery features using the professional data returned by the backend.

### Search

Users can search professionals by relevant displayed information.

Example:

```text
Search: Rahul
```

The application correctly filters the results to Rahul Plumber.

### Service Filtering

The application supports service categories such as:

```text
Electrical
Plumbing
```

The frontend dynamically filters the professionals currently loaded from the backend.

### Sorting

The application supports sorting options such as lowest price.

Example current data:

```text
Rahul Plumber       ₹450
John Electrician    ₹500
Booking Test        ₹700
```

Selecting lowest price places Rahul Plumber first.

---

## Authentication and Authorization

JWT-based authentication is used for protected API operations.

### Authentication Flow

```text
User
 ↓
Login Form
 ↓
POST /api/auth/login
 ↓
Backend verifies email/password
 ↓
JWT generated
 ↓
Frontend stores token
 ↓
Token attached to protected requests
```

The JWT contains the authenticated user's ID and role.

Example protected request:

```text
Authorization: Bearer <token>
```

### Password Security

Passwords are never stored as plain text.

The backend uses bcryptjs:

```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

During login, bcrypt compares the submitted password against the stored hash.

### Role-Based Authorization

Supported roles include:

```text
customer
professional
admin
```

Professional creation requires an authenticated professional or admin account.

Admin privileges cannot be assigned through ordinary customer registration.

---

## Ownership and Authorization Checks

The backend performs ownership checks for protected resources.

For professional listings:

- A professional can manage their own listing.
- An admin can manage professional listings.
- Unauthorized users cannot modify another professional's listing.

For bookings:

- Authenticated users can access their own booking records.
- Booking access is restricted using the authenticated user identity.
- Unauthorized access is rejected by the backend.

These checks prevent users from simply changing an ID in the request and accessing another user's protected data.

---

## Validation

Validation is implemented on both the frontend and backend.

### Frontend Validation

Examples include:

- Required booking date
- Required time
- Required service address
- Required issue description
- Required login email
- Required password

### Backend Validation

The backend uses:

- express-validator
- Mongoose schema validation
- ObjectId validation
- Required field validation
- Enum validation
- Numeric constraints

This provides multiple layers of protection against invalid data.

---

## Error Handling

The application handles API errors using appropriate HTTP status codes and user-facing messages.

Examples include:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

The frontend displays appropriate error messages and provides retry or recovery options where applicable.

Loading states are also displayed while asynchronous API requests are in progress.

---

## State Management

The frontend uses React state and `AppContext` for shared application behavior.

Important state includes:

- Authentication information
- Booking operations
- Loading states
- Error states
- Booking persistence
- API-related UI updates

The Dashboard maintains its own fetched booking state so that the backend remains the source of truth for authenticated booking data.

Authentication information is stored in browser local storage using:

```text
fixit_token
fixit_user
```

The JWT is then used for protected API requests.

---

## Booking Data Flow

The booking process follows this flow:

```text
Customer selects professional
        ↓
Professional detail page
        ↓
Customer enters booking information
        ↓
Frontend validation
        ↓
POST /api/bookings
        ↓
JWT authentication
        ↓
Backend validation
        ↓
Booking Controller
        ↓
Mongoose
        ↓
MongoDB Atlas
        ↓
Booking created
        ↓
JSON response
        ↓
Success message in React
        ↓
Dashboard displays booking
```

---

## Booking Cancellation Flow

The cancellation process follows:

```text
Dashboard
   ↓
Customer clicks Cancel
   ↓
Frontend sends DELETE request
   ↓
JWT authentication
   ↓
Backend checks booking ownership
   ↓
Booking cancelled/deleted
   ↓
API response
   ↓
Dashboard refreshes booking data
```

---

## Testing

The backend was tested using Jest and Supertest.

Latest automated test results:

```text
Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
Snapshots:   0 total
```

The three test suites cover:

- Authentication
- Professional APIs
- Booking APIs

The tests cover successful operations as well as validation, authentication, authorization, and error scenarios.

---

## Manual Integration Testing

The application was also tested through the actual React user interface.

The following flow was successfully verified:

```text
Open FixIt
   ↓
Load professionals from backend
   ↓
Search professionals
   ↓
Filter by service
   ↓
Sort by price
   ↓
Open professional detail
   ↓
Login
   ↓
Submit booking
   ↓
Booking created
   ↓
Open Dashboard
   ↓
View booking
   ↓
Cancel booking
   ↓
Booking removed/cancelled
   ↓
Logout
```

Additional dynamic-data verification was performed with multiple professional records.

Current verified examples include:

```text
Booking Test Electrician
John Electrician
John Electrician
Rahul Plumber
```

The frontend successfully displayed these records through the backend API.

---

## Production Build

The frontend production build was successfully generated using Vite.

Latest build result:

```text
vite v8.3.0 building client environment for production...

1898 modules transformed.

dist/index.html                   0.82 kB
dist/assets/index-cUbw6cNy.css   14.12 kB
dist/assets/index-B0dQrRsg.js   295.46 kB

Build completed successfully.
```

Compressed sizes reported by Vite:

```text
JavaScript: approximately 92.32 kB gzip
CSS: approximately 3.82 kB gzip
```

The build completed without errors.

---

## Security Practices

The project includes several security-focused practices:

- Password hashing with bcryptjs
- JWT authentication
- Protected API routes
- Role-based authorization
- Resource ownership checks
- Environment variables for database credentials and JWT secrets
- `.env` excluded through `.gitignore`
- Client-supplied admin privileges are not accepted during ordinary registration
- Input validation
- ObjectId validation
- Appropriate HTTP status codes
- No password values returned in authentication responses
- CORS configuration
- Separation of authentication and business logic

Sensitive configuration should never be committed to the repository.

---

## Environment Configuration

### Backend `.env`

Create a `.env` file inside the backend project:

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit the real `.env` file.

A safe example is provided through:

```text
.env.example
```

### Frontend `.env`

Create a `.env` file inside the frontend project:

```text
VITE_API_URL=http://localhost:5000/api
```

Do not place private backend credentials or JWT secrets in the frontend environment.

Only the public API base URL should be exposed through the Vite frontend environment.

---

## Local Setup

### Prerequisites

Install:

- Node.js
- npm
- MongoDB Atlas account
- Git
- VS Code or another code editor

---

### Backend Installation

Open a terminal and run:

```bash
cd C:\Users\syedu\OneDrive\Desktop\fixit-backend
npm install
```

Create the backend `.env` file:

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

Expected output:

```text
FixIt Backend Server running on port 5000
MongoDB connected successfully
```

The API will be available at:

```text
http://localhost:5000
```

---

### Frontend Installation

Open another terminal:

```bash
cd C:\Users\syedu\OneDrive\Desktop\FixIt_Week2_Frontend\fixit-frontend
npm install
```

Create the frontend `.env` file:

```text
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Vite will provide the local frontend address, normally:

```text
http://localhost:5173
```

---

## Running Tests

From the backend folder:

```bash
npm test
```

The configured test command runs:

```bash
jest --runInBand
```

Expected current result:

```text
3 test suites passed
25 tests passed
```

---

## Frontend Production Build

From the frontend folder:

```bash
npm run build
```

The command creates the production files inside:

```text
dist/
```

A successful build confirms that the integrated frontend can be compiled for production.

---

## API Documentation

Detailed endpoint documentation is available in:

```text
docs/API.md
```

The API documentation contains endpoint information, HTTP methods, parameters, request examples, authentication requirements, and response structures.

---

## Error and Recovery Behavior

The application includes handling for common failure scenarios.

Examples include:

### Backend unavailable

The frontend displays an API error instead of remaining in an indefinite loading state.

### Invalid login

The user receives an authentication error message.

### Unauthorized API request

The backend returns an appropriate authorization response.

### Invalid booking information

Frontend and backend validation prevent incomplete data from being submitted.

### Invalid professional ID

The backend validates MongoDB ObjectIds before attempting database operations.

### Booking cancellation

After cancellation, the dashboard refreshes the booking state so that the UI reflects the latest backend result.

---

## Challenges and Solutions

### 1. React Blank Screen / Invalid Hook Call

During integration, the frontend initially displayed a blank page with an invalid React hook error.

The issue was traced to a nested:

```text
src/node_modules
```

directory causing an incorrect React module resolution.

The nested dependency folder was removed and the Vite cache was cleared.

The application then loaded correctly.

---

### 2. Backend and Frontend Data Shape Differences

The original frontend was designed around mock professional data while the backend returned MongoDB documents with fields such as:

```text
_id
name
service
description
location
rating
price
availability
```

A mapping layer was added in the frontend so that backend data could be displayed using the existing UI structure.

This allowed the existing reusable components to continue working without duplicating backend data.

---

### 3. Booking Data Shape Differences

The Dashboard originally expected mock booking structures.

It was updated to consume the actual backend booking response, including:

```text
_id
professional
service
date
time
address
issue
status
```

This allowed the Dashboard to display real database records.

---

### 4. Booking Status Mismatch

The backend uses:

```text
pending
confirmed
completed
cancelled
```

while the frontend UI uses more user-friendly status labels.

A mapping layer was implemented so backend status values can be translated into frontend display states without changing the database enum.

---

### 5. Authentication State

The Navbar originally reflected the static prototype state.

It was updated to check the authentication token stored in local storage.

When the user is logged in:

```text
Log Out
```

is displayed.

When the user logs out, the token and stored user information are removed and the user is returned to the Login page.

---

### 6. Professional Authorization

Professional creation is protected by authentication and role checks.

A customer attempting to create a professional receives a permission error.

A professional account can create a professional listing after authentication.

This demonstrates that authorization is being enforced by the backend rather than only by the frontend.

---

### 7. Git Repository Structure

During integration, the frontend Git repository was initially initialized at an incorrect parent directory.

The accidental repository was removed and Git was reinitialized inside the actual frontend project.

The frontend was then merged with its existing GitHub history and pushed successfully.

The backend repository was also maintained separately.

---

## GitHub Repositories

### Frontend

https://github.com/Anamkhan0706/fixit-frontend

### Backend

https://github.com/Anamkhan0706/fixit-backend

The repositories contain the source code required to run and review the frontend and backend independently.

---

## Current Verified Data Flow

The current application has been manually verified with real database data.

Example professional records include:

```text
Booking Test Electrician
Service: Electrical
Price: ₹700
Location: Bengaluru

John Electrician
Service: Electrical
Price: ₹500
Location: Bengaluru

John Electrician
Service: Electrical
Price: ₹500
Location: Bengaluru

Rahul Plumber
Service: Plumbing
Price: ₹450
Location: Bengaluru
```

The frontend successfully displays these records through the backend API.

The following behaviors were verified:

```text
GET professionals
        ↓
4 professionals displayed
        ↓
Plumbing filter
        ↓
1 professional displayed
        ↓
Electrical filter
        ↓
3 professionals displayed
        ↓
Search "Rahul"
        ↓
Rahul Plumber displayed
        ↓
Lowest price sorting
        ↓
Rahul Plumber displayed first
```

---

## Development Best Practices

The project follows several full-stack development practices:

- Separation of frontend and backend responsibilities
- RESTful API design
- Reusable React components
- Shared React context where appropriate
- Controller-based backend organization
- Mongoose models for database structure
- Middleware for cross-cutting concerns
- Environment-based configuration
- Validation before database operations
- Authentication for protected resources
- Authorization and ownership checks
- Consistent JSON API responses
- HTTP status codes for API outcomes
- Automated backend testing
- Production build verification
- Git version control
- API documentation

---

## Limitations and Future Improvements

Possible future improvements include:

- Deploying the frontend and backend to production hosting
- Adding real-time booking status updates
- Adding professional availability scheduling
- Adding customer reviews and ratings
- Adding image uploads for professionals
- Adding pagination for large professional lists
- Adding advanced search and filtering
- Adding password reset functionality
- Adding email notifications
- Adding booking history and analytics
- Improving automated frontend test coverage
- Adding API rate limiting
- Adding production monitoring and logging

---

## Project Outcome

The FixIt application now demonstrates a functional full-stack architecture in which the React frontend communicates with a Node.js/Express backend, which in turn communicates with MongoDB Atlas.

The application supports:

- Real database-driven professional listings
- Dynamic search
- Service filtering
- Price sorting
- Professional detail pages
- JWT authentication
- Role-based authorization
- Protected booking APIs
- Booking creation
- Booking retrieval
- Booking cancellation
- Validation
- Error handling
- Loading states
- Ownership checks
- Automated API testing
- Production frontend builds
- API documentation
- GitHub-based source control

The completed integration provides a clear end-to-end data flow from the user interface through REST APIs and business logic to persistent MongoDB data and back to the frontend.