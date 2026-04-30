import express from "express"
import { getAllEnrollment, getEnrollmentByStudent, getEnrollmentById, createEnrollment, updateEnrollment, deleteEnrollment } from "../controllers/enrollmentControllers.js"
import { validateEnrollment } from "../middleware/validateEnrollment.js"
import { authCheck } from "../middleware/auth-middleware.js"



export const enrollmentRouter = express.Router()


enrollmentRouter.get("/", authCheck, getAllEnrollment)
enrollmentRouter.get("/student/:studentId", authCheck, getEnrollmentByStudent)
enrollmentRouter.get("/:id", authCheck, getEnrollmentById)
enrollmentRouter.post("/", authCheck, validateEnrollment, createEnrollment)
enrollmentRouter.put("/:id", authCheck, updateEnrollment)
enrollmentRouter.delete("/:id", authCheck, deleteEnrollment)
