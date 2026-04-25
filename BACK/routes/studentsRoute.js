import express from "express"
import { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } from "../controllers/studentsControllers.js"
import multerConfig from "../middleware/multer-config.js"
import { validateStudent } from "../middleware/validateStudent.js"
import { authCheck } from "../middleware/auth-middleware.js"



export const studentRouter = express.Router()

studentRouter.post("/signup",   (req, res, next) => {
    multerConfig(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message })
      next()
    })
}, validateStudent, createStudent)
  
studentRouter.get("/", authCheck, getAllStudents)
studentRouter.get("/:id", authCheck, getStudentById)
studentRouter.put("/:id", authCheck, multerConfig, updateStudent) //update pfp
studentRouter.delete("/:id", authCheck, deleteStudent)


