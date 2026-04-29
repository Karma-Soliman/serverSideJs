import express from "express"
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } from "../controllers/coursesControllers.js"
import { validateCourse } from "../middleware/validateCourse.js"
import { authCheck } from "../middleware/auth-middleware.js"



export const courseRouter = express.Router()

courseRouter.post("/", authCheck, validateCourse, createCourse)
courseRouter.get("/", authCheck, getAllCourses)
courseRouter.get("/:id", authCheck, getCourseById)
courseRouter.put("/:id", authCheck, updateCourse)
courseRouter.delete("/:id", authCheck, deleteCourse)

