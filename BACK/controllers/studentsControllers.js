import {
  findAllUsers,
  findUser,
  createStudentService,
  updateStudentService,
  deleteStudentService,
} from "../services/studentsServiceMongoDB.js"
import { toStudentDTO, studentListDTO, studentPublicDTO } from "../dto/studentDTO.js"

export const getAllStudents = async (req, res) => {
  try {
    const students = await findAllUsers()
    res.status(200).json(students.map(studentListDTO))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getStudentById = async (req, res) => {
  try {
    const student = await findUser(req.params.id)
    if (!student) return res.status(404).json({ message: "Student not found" })
    
    res.status(200).json(studentPublicDTO(student))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createStudent = async (req, res) => {
  try {
    const { name, email, password, gpa, major } = req.body
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null
    const newStudent = await createStudentService({ name, email, password, gpa, major, image: imageUrl })
    res.status(201).json(toStudentDTO(newStudent))
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateStudent = async (req, res) => {
    console.log("req.file:", req.file)
    console.log("req.body:", req.body)
  try {
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null

    const { image, ...rest } = req.body
    const data = { ...rest, ...(imageUrl && { image: imageUrl }) }
    const student = await updateStudentService(req.params.id, data)
    res
      .status(200)
      .json({ message: "Student updated successfully", data: toStudentDTO(student) })
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
