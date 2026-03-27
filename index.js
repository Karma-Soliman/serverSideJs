import express from "express";
import cors from 'cors';
import { studentRouter } from "./routes/studentsRoute.js"
const app = express();
const port = 5500;


app.use(cors());
app.use(express.json());
app.use("/students", studentRouter)

const prof = [{ "my_json": "hi prof" }]

app.get("/", (req, res) => {
    res.json(prof);
})

//app.post("/", (req, res) => {
//    const { test, firstName } = req.body
//    res.json({test, firstName})
//})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

// NODEMON

// send data to the exposed endpoints
// import data from students.json and send it to the client when they hit the endpoint
// use postman to send data to endpoints

// GET - retrieve data
// POST - create new data
// PUT - update existing data
// DELETE - remove data
// CRUD - create, read, update, delete

// SEND DATA vs SEND ERROR
// STATUS CODES - 200, 201, 400, 404
// JSON - JavaScript Object Notation
// res.json() - send JSON response
// res.status() - set status code
// res.send() - send response

// TRY FRONTEND NOW before moving on
// go to FONT folder and open index.html in the browser, check console for errors, fix them, and see the data being displayed

// CORS - Cross-Origin Resource Sharing
// npm i cors
// app.use(cors())

// REFACTORING
// 1. Create a separate file for routes (e.g., routes.js)
// 2. Create a separate file for controllers (e.g., controllers.js)
// 3. Change commonJs to ES6 modules (e.g., import/export) - this will require adding "type": "module" in package.json

// push to github and share the link
