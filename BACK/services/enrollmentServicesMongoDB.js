import Enrollment from "../models/enrollmentModel.js"
import mongoose from "mongoose"

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

export const findAllEnrollment = async () => {
  return await Enrollment.find({})
    .populate("student", "name email")
    .populate("course", "title instructor, credits")//pulls fields from user and course
}

export const findEnrollmentById = async (id) => {
  if (!isValidId(id)) throw new Error("Invalid enrollment ID")
  return await Enrollment.findById(id)
    .populate("student", "name email")
    .populate("course", "title instructor, credits")
}

export const findEnrollmentByStudent = async (studentId) => {
  if (!isValidId(id)) throw new Error("Invalid enrollment ID")
  return await Enrollment.find({student: studentId})
    .populate("course", "title instructor, credits")
}

export const deleteEnrollmentService = async (id) => {
  if (!isValidId(id)) throw new Error("Invalid enrollment ID")
  const enroll = await Enrollment.findById(id)
  if (!enroll) throw new Error("Enrollment not found")
  return await Enrollment.findByIdAndDelete(id)
}

export const createEnrollmentService = async (data) => {
  return await Enrollment.create(data)
}

export const updateEnrollmentService = async (id, data) => {
  if (!isValidId(id)) throw new Error("Invalid enrollment ID")
  const enroll = await Enrollment.findById(id)
  if (!enroll) throw new Error("Enrollment not found")

  return await Enrollment.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  })
}
