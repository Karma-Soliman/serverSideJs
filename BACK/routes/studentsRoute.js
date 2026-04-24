import express from "express"
import { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } from "../controllers/studentsControllers.js"
import multerConfig from "../middleware/multer-config.js"
import { validateStudent } from "../middleware/validateStudent.js"



export const studentRouter = express.Router()

studentRouter.post("/signup",   (req, res, next) => {
    multerConfig(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message })
      next()
    })
  }, validateStudent,createStudent)
studentRouter.get("/", getAllStudents)
studentRouter.get("/:id", getStudentById)
studentRouter.put("/:id", multerConfig, updateStudent) //update pfp
studentRouter.delete("/:id", deleteStudent)


