import {
  findAllUsers,
  findUser,
  createStudentService,
  updateStudentService,
  deleteStudentService,
} from "../services/studentsService.js"

export const getAllStudents = (req, res) => {
  try {
    const students = findAllUsers()
    res.status(200).json(students)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getStudentById = (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const student = findUser(id)
    res.status(200).json(student)
  } catch (error) {
    res.status(404).json({ message: "Student not found" })
    return
  }
}

export const createStudent = (req, res) => {
  try {
    const newStudent = createStudentService(req.body)
    res
      .status(201)
      .json({ message: "Student created successfully", data: newStudent })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateStudent = (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const student = updateStudentService(id, req.body)
    res
      .status(200)
      .json({ message: "Student updated successfully", data: student })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const deleteStudent = (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const deleted = deleteStudentService(id)
    res.status(200).json({ message: "Student deleted successfully" })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
