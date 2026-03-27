import express from "express"
import { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } from "../controllers/studentsControllers.js"

export const studentRouter = express.Router()

studentRouter.get("/", getAllStudents)
studentRouter.get("/:id", getStudentById)
studentRouter.post("/", createStudent)
studentRouter.put("/:id", updateStudent)
studentRouter.delete("/:id", deleteStudent)


