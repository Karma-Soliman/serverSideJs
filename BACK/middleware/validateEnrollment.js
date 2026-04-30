import mongoose from "mongoose"

export const validateEnrollment = (req, res, next) => {
  const { student, course, semester, grade, status } = req.body

    const reject = (message) => res.status(400).json({ message })
    
  const validStatuses = ["enrolled", "completed", "dropped"]
  const semester_regex = /^(Fall|Spring|Summer)\s(20\d{2})$/

  if (!student) return reject("Student ID is required")
  if (!mongoose.Types.ObjectId.isValid(student))
    return reject("Invalid student ID format")

  if (!course) return reject("Course ID is required")
  if (!mongoose.Types.ObjectId.isValid(course))
    return reject("Invalid course ID format")

  if (grade !== undefined && grade !== null && grade !== "") {
    if (isNaN(grade)) return reject("Grade must be a number")
    if (Number(grade) < 0 || Number(grade) > 20)
      return reject("Grade must be between 0 and 20")
  }

  if (!semester) return reject("Semester is required")
  if (!semester_regex.test(semester.trim()))
    return reject(
      "Semester must be in format: Fall 2024, Spring 2025, or Summer 2025",
    )

  if (status && !validStatuses.includes(status))
    return reject(`Status must be one of: ${validStatuses.join(", ")}`)

  next()
}
