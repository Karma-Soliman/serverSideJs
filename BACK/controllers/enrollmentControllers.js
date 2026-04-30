import {
  findAllEnrollment,
  findEnrollmentById,
  findEnrollmentByStudent,
  createEnrollmentService,
  updateEnrollmentService,
  deleteEnrollmentService,
} from "../services/enrollmentServicesMongoDB.js"

export const getAllEnrollment = async (req, res) => {
  try {
    const enroll = await findAllEnrollment()
    res.status(200).json(enroll)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getEnrollmentById = async (req, res) => {
  try {
    const enroll = await findEnrollmentById(req.params.id)
    if (!enroll)
      return res.status(404).json({ message: "Enrollment not found" })
    res.status(200).json(enroll)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getEnrollmentByStudent = async (req, res) => {
  try {
    const enroll = await findEnrollmentByStudent(req.params.studentId)
    res.status(200).json(enroll)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createEnrollment = async (req, res) => {
  try {
    const { student, course, semester, grade, status } = req.body
    const newEnroll = await createEnrollmentService({
      student,
      course,
      semester: semester.trim(),
      ...(grade !== undefined && grade !== "" && { grade: Number(grade) }),
      ...(status && { status }),
    })
    res.status(201).json(newEnroll)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({message: "Student is already enrolled in this course this semester"})
    }
    res.status(400).json({ message: error.message })
  }
}

export const updateEnrollment = async (req, res) => {
  try {
    const {semester, grade, status } = req.body
    const data = {}
    if (grade !== undefined) data.grade = grade
      if (semester) data.semester = semester
      if (status) data.status = status
    const enroll = await updateEnrollmentService(req.params.id, data)
    res.status(200).json({
      message: "Enrollment updated successfully",
      data: enroll,
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const deleteEnrollment = async (req, res) => {
  try {
    const deleted = await deleteEnrollmentService(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Enrollment not found" })
    res.status(200).json({ message: "Enrollment deleted successfully" })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
