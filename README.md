# Student Management API

This project is a full Student Management application built with a Node.js/Express backend, MongoDB/Mongoose data models, JWT authentication, protected API routes, and a vanilla HTML/CSS/JavaScript frontend.

The completed version of the project is on the `frontend` branch.

## Overview

The app manages three school-related resources:

- `Students`: users who can sign up, log in, view students, and update/delete only their own profile.
- `Courses`: the required new assessment resource. Courses have a title, description, credits, and instructor.
- `Enrollments`: an extra relationship resource that connects students to courses for a semester.

The backend follows the same structure for each resource:

- `models/`: Mongoose schemas
- `services/`: database logic
- `controllers/`: request/response handling
- `routes/`: Express route definitions
- `middleware/`: authentication, validation, and upload handling

## Project Structure

```txt
serverSideJs/
├── BACK/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── coursesControllers.js
│   │   ├── enrollmentControllers.js
│   │   └── studentsControllers.js
│   ├── dto/
│   │   └── studentDTO.js
│   ├── middleware/
│   │   ├── auth-middleware.js
│   │   ├── multer-config.js
│   │   ├── validateCourse.js
│   │   ├── validateEnrollment.js
│   │   └── validateStudent.js
│   ├── models/
│   │   ├── courseModel.js
│   │   ├── enrollmentModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── coursesRoute.js
│   │   ├── enrollmentRoute.js
│   │   └── studentsRoute.js
│   ├── services/
│   │   ├── coursesServicesMongoDB.js
│   │   ├── enrollmentServicesMongoDB.js
│   │   └── studentsServiceMongoDB.js
│   ├── public/uploads/
│   ├── index.js
│   └── package.json
│
└── FONT/
    ├── index.html
    ├── students.html
    ├── script.js
    ├── students.js
    ├── style.css
    └── favicon.svg
```

## Tech Stack

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Tokens
- bcrypt
- multer
- Vanilla HTML, CSS, and JavaScript

## Setup

Install dependencies from the backend folder:

```bash
cd BACK
npm install
```

Create a `.env` file inside `BACK/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

The API runs on:

```txt
http://localhost:5500
```

Then open the frontend in the browser:

```txt
FONT/index.html
```

## Authentication

Students sign up or log in from the frontend. The backend returns a JWT token, and the frontend stores it in `localStorage`.

Protected routes require:

```txt
Authorization: Bearer <token>
```

If a request has no token, the API returns `401`.

Students can view the list of students, but they can only update or delete their own account. The frontend also hides edit/delete actions for other students and shows a message explaining that only your own account can be modified.

## API Routes

Base URL:

```txt
http://localhost:5500/api
```

### Students

```txt
POST   /students/signup
POST   /students/login
GET    /students
GET    /students/:id
PUT    /students/:id
DELETE /students/:id
```

Student routes use authentication except for signup and login.

### Courses

```txt
GET    /courses
GET    /courses/:id
POST   /courses
PUT    /courses/:id
DELETE /courses/:id
```

All course routes are protected by `authCheck`.

Course fields:

- `title`
- `description`
- `credits`
- `instructor`

### Enrollments

```txt
GET    /enrollments
GET    /enrollments/:id
GET    /enrollments/student/:studentId
POST   /enrollments
PUT    /enrollments/:id
DELETE /enrollments/:id
```

All enrollment routes are protected by `authCheck`.

Enrollment fields:

- `student`: reference to a `User`
- `course`: reference to a `Course`
- `semester`
- `grade`
- `status`

The enrollment model uses references so each enrollment connects one student with one course. It also has a unique index to prevent the same student from enrolling in the same course during the same semester more than once.

## Frontend

The frontend has two main pages:

- `index.html`: login and signup page
- `students.html`: authenticated dashboard

The dashboard displays:

- Students
- Courses
- Enrollments

From the dashboard, a logged-in user can:

- view all students
- view their own profile details
- edit their own profile
- delete their own account
- create, edit, and delete courses
- create, edit, and delete enrollments

When editing a profile, the form keeps the current details as placeholders so the user can update only one field without retyping everything.

## Assessment Resource

The required new resource for the final assessment is `Course`.

It includes:

- Mongoose model: `BACK/models/courseModel.js`
- Service: `BACK/services/coursesServicesMongoDB.js`
- Controller: `BACK/controllers/coursesControllers.js`
- Router: `BACK/routes/coursesRoute.js`
- Entry point registration in `BACK/index.js`

The course API supports full CRUD and all 5 required routes are protected by `authCheck`.

## Extra Resource

`Enrollment` was added as an extra resource to make the school system more complete. It is not the required assessment resource, but it demonstrates relationships between MongoDB documents using Mongoose references and `populate()`.

## Testing Checklist

Use Postman with a valid JWT token to test:

- `POST /api/courses`: create at least 2 courses
- `GET /api/courses`: return all courses
- `GET /api/courses/:id`: return one course by MongoDB `_id`
- `PUT /api/courses/:id`: update one course field
- `DELETE /api/courses/:id`: delete one course
- `GET /api/courses` without a token: return `401`

You can also test enrollments by creating a student, creating a course, then creating an enrollment with both IDs.

## Notes

- The backend must be running before using the frontend.
- MongoDB Atlas must allow your current IP address, otherwise the backend will fail to connect.
- Uploaded student profile images are stored in `BACK/public/uploads`.
- The final completed branch is `frontend`.
