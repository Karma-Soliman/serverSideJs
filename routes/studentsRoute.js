import express from "express"
import { getAllStudents } from "../controllers/studentsControllers.js"

export const studentRouter = express.Router()

studentRouter.get("/", getAllStudents)
