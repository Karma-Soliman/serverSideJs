import express from "express";
import cors from 'cors';
import { connectToMongoDB } from "./config/db.js";

import { studentRouter } from "./routes/studentsRoute.js";

const app = express();
const port = 5500;

await connectToMongoDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/students", studentRouter);
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.send("Server is running ...");
})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

