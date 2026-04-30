import express from "express";
import cors from 'cors';
import { connectToMongoDB } from "./config/db.js";

import { studentRouter } from "./routes/studentsRoute.js";
import { courseRouter } from "./routes/courseRoute.js"
import { enrollmentRouter } from "./routes/enrollmentRoute.js"


const app = express();
const port = 5500;

await connectToMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"))

app.use("/api/students", studentRouter);
app.use("/api/courses", courseRouter)
app.use("/api/enrollments", enrollmentRouter)

app.get("/", (req, res) => {
    res.send("Server is running ...");
})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

