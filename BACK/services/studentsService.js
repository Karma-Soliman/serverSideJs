import { students } from "../../DATA/students.js"

export const findAllUsers = () => {
  if (!students || students.length === 0) {
    throw new Error("user not found")
  } else {
    return students
  }
}

export const findUser = (id) => {
  const found = students.find((student) => student.id === id)
  if (found) {
    return found
  } else {
    throw new Error("user not found")
  }
}

const isValidName = (name) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name.trim())
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
const isValidMajor = (major) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(major.trim())
const isValidGpa = (gpa) => typeof gpa === "number" && gpa >= 0 && gpa <= 4.0

const validateStudentData = (data) => {
  const errors = []

  if (!data.name || !isValidName(data.name)) {
    errors.push("name can contain letters, spaces, hyphens, or apostrophes")
  }
  if (!data.email || !isValidEmail(data.email)) {
    errors.push("email is required and must be a valid email address")
  }
  if (!data.major || !isValidMajor(data.major)) {
    errors.push("major can contain letters, spaces, hyphens, or apostrophes")
  }
  if (data.gpa === undefined || data.gpa === null || !isValidGpa(data.gpa)) {
    errors.push("GPA must be a number between 0 and 4.0")
  }

  return errors
}

export const createStudentService = (data) => {
  const errors = validateStudentData(data)
  if (errors.length > 0) {
    throw new Error(errors.join(", "))
  }

  const emailExists = students.some(
    (s) => s.email.toLowerCase() === data.email.toLowerCase(),
  )
  if (emailExists) {
    throw new Error("Email already exists")
  }

  const newStudent = {
    id: students.length + 1,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    major: data.major.trim(),
    gpa: data.gpa,
  }

  students.push(newStudent)
  return newStudent
}

export const updateStudentService = (id, data) => {
  const index = students.findIndex((student) => student.id === id)
  if (index === -1) {
    throw new Error("Student not found")
  }
  const updated = { ...students[index], ...data }
  const errors = validateStudentData(updated)
  if (errors.length > 0) {
    throw new Error(errors.join(", "))
  }
  students[index] = updated
  return students[index]
}

export const deleteStudentService = (id) => {
  const index = students.findIndex((student) => student.id === id)
  if (index === -1) {
    throw new Error("Student not found")
  }
  const deleted = students.splice(index, 1)
  return deleted[0]
}
