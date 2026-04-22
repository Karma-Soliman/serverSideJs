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

