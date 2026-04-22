import express from "express"
import { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } from "../controllers/studentsControllers.js"
import multerConfig from "../middleware/multer-config.js"
import { validateStudent } from "../middleware/validateStudent.js"



export const studentRouter = express.Router()

studentRouter.post("/signup", validateStudent,createStudent)
studentRouter.get("/", getAllStudents)
studentRouter.get("/:id", getStudentById)
studentRouter.put("/:id", updateStudent)
studentRouter.delete("/:id", deleteStudent)


