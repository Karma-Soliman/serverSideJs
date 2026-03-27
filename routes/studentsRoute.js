import express from "express"
import { getAllStudents } from "../controllers/studentsControllers.js"

export const studentRouter = express.Router()

studentRouter.get("/students", getAllStudents)
studentRouter.get("/students/:id", getStudentById)
studentRouter.post("/students", createStudent)
studentRouter.put("/students/:id", updateStudent)
studentRouter.delete("/students/:id", deleteStudent)


