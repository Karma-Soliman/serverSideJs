import {
  findAllUsers,
  findUser,
  createStudentService,
  updateStudentService,
  deleteStudentService,
} from "../services/studentsServiceMongoDB.js"

export const getAllStudents = async (req, res) => {
  try {
    const students = await findAllUsers()
    res.status(200).json(students)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getStudentById = async (req, res) => {
  try {
    const student = await findUser(req.params.id)
    if (!student) return res.status(404).json({ message: "Student not found" })
    res.status(200).json(student)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createStudent = async (req, res) => {
  try {
    const newStudent = await createStudentService(req.body)
    res.status(201)
      .json({ message: "Student created successfully", data: newStudent })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateStudent = async (req, res) => {
  try {
    const student = await updateStudentService(req.params.id, req.body)
    res
      .status(200)
      .json({ message: "Student updated successfully", data: student })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const deleteStudent = async (req, res) => {
  try {
    const deleted = await deleteStudentService(req.params.id)
    res.status(200).json({ message: "Student deleted successfully" })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
