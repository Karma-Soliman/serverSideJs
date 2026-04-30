import {
  findAllCourses,
  findCourse,
  createCourseService,
  updateCourseService,
  deleteCourseService
} from "../services/coursesServicesMongoDB.js"

export const getAllCourses = async (req, res) => {
  try {
    const courses = await findAllCourses()
    res.status(200).json(courses)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getCourseById = async (req, res) => {
  try {
    const course = await findCourse(req.params.id)
    if (!course) return res.status(404).json({ message: "Course not found" })
    res.status(200).json(course)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createCourse = async (req, res) => {
  try {
    const { title, description, credits, instructor} = req.body
    const newCourse = await createCourseService({
      title: title.trim(),
      description: description.trim(),
      credits: Number(credits),
      instructor: instructor.trim(),
    })
    res.status(201).json(newCourse)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateCourse = async (req, res) => {
  try {
    const { title, description, credits, instructor } = req.body
    const data = {}
      if (title) data.title = title
      if (description) data.description = description
      if (credits) data.credits = Number(credits)
      if (instructor) data.instructor = instructor
    const course = await updateCourseService(req.params.id, data)
    res
      .status(200)
      .json({
        message: "Course updated successfully",
        data: course,
      })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const deleteCourse = async (req, res) => {
  try {
      const deleted = await deleteCourseService(req.params.id)
      if (!deleted) return res.status(404).json({ message: "Course not found" })
    res.status(200).json({ message: "Course deleted successfully" })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}