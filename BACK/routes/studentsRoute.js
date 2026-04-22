import express from "express"
import { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } from "../controllers/studentsControllers.js"
import multerConfig from "../middleware/multer-config.js"



export const studentRouter = express.Router()

studentRouter.post("/signup", multerConfig, (req, res) => {
  console.log("req.file:", req.file)
  console.log("req.body:", req.body)

  res.send("login")
})
studentRouter.get("/", getAllStudents)
studentRouter.get("/:id", getStudentById)
studentRouter.post("/", createStudent)
studentRouter.put("/:id", updateStudent)
studentRouter.delete("/:id", deleteStudent)


