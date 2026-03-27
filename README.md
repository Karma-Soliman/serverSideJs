# Exercise 01 — File System & JSON
# Students REST API

A Node.js REST API built with Express 5 that manages student data. It follows a clean architecture with separated routes, controllers, and services, and includes a vanilla JS frontend to display the data.

---

## Project Structure

```
serverSideJs/
├── index.js                        # Entry point — sets up Express, middleware, and routes
├── students.js                     # Exports student data from students.json
├── students.json                   # Local data source (acts as a mock database)
├── package.json
│
├── routes/
│   └── studentsRoute.js            # Defines all /students endpoints
│
├── controllers/
│   └── studentsControllers.js      # Handles req/res for each route
│
├── services/
│   └── studentsService.js          # Business logic and data validation
│
└── FONT/
    ├── index.html                  # Frontend HTML
    ├── script.js                   # Fetches and renders student cards
    └── style.css                   # Styling
```

---

## Tech Stack

- **Runtime**: Node.js v24
- **Framework**: Express 5
- **Module system**: ES Modules (`"type": "module"` in package.json)
- **Dev tool**: Nodemon (auto-restarts server on file save)
- **CORS**: `cors` package to allow frontend requests from a different origin

---

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm

### Installation

```bash
npm install
```

### Running the server

```bash
# Production
npm run epita

# Development (with auto-restart via nodemon)
npm run dev
```

The server starts on `http://localhost:5500`.

---

## API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get a single student by ID |
| POST | `/students` | Create a new student |
| PUT | `/students/:id` | Update an existing student |
| DELETE | `/students/:id` | Delete a student |

---

## Validation Rules

All fields are validated in `services/studentsService.js` before any data is created or updated.

| Field | Rule |
|-------|------|
| `name` | Required. Letters, spaces, hyphens, and apostrophes only (accented characters supported) |
| `email` | Required. Must match valid email format (e.g. `user@domain.com`) |
| `major` | Required. Letters, spaces, hyphens, and apostrophes only |
| `gpa` | Required. Must be a number between `0` and `4.0` |

---

## Architecture

The project follows a three-layer separation of concerns:

**Routes** — define which HTTP method and URL maps to which controller function

**Controllers** — call the appropriate service function, and return the HTTP response.

**Services** — contain all business logic and validation.

---

## Frontend

Open `FONT/index.html` in a browser to view the student cards.

> Make sure the backend server is running before opening the frontend.

---

## Notes

- Data is stored in memory — changes made via POST, PUT, or DELETE will reset when the server restarts, as the source `students.json` is not written to disk