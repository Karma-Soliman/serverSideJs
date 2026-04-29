import Course from "../models/courseModel.js"
import mongoose from "mongoose"

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

export const findAllCourses = async () => {
  return await Course.find({})
}

export const findCourse = async (id) => {
    if (!isValid(id)) throw new Error("Invalid course ID")
  return await Course.findById(id)
}

export const deleteCourseService = async (id) => {
    if (!isValid(id)) throw new Error("Invalid course ID")
  const course = await Course.findById(id)
  if (!course) throw new Error("Course not found")
  return await Course.findByIdAndDelete(id)
}

export const createCourseService = async (data) => {
  return await Course.create(data)
}

export const updateCourseService = async (id, data) => {
    if (!isValid(id)) throw new Error("Invalid course ID")
  const course = await Course.findById(id)
  if (!course) throw new Error("Course not found")

  return await Course.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  })
}