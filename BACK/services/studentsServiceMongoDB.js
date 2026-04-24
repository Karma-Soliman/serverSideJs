import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import fs from "fs"

const SALT_ROUNDS = 10

export const findAllUsers = async () => {
  return await User.find({})
}

export const findUser = async (id) => {
  return await User.findById(id)
}

export const deleteStudentService = async (id) => {
  const user = await User.findById(id)
  if (!user) throw new Error("Student not found")
  if (user.image) {
    const filename = user.image.split("/uploads/")[1]
    if (filename) fs.unlink(`public/uploads/${filename}`, () => {})
  }
  return await User.findByIdAndDelete(id)
}

export const createStudentService = async (data) => {
  const hashedPass = await bcrypt.hash(data.password, SALT_ROUNDS)
  return await User.create({ ...data, password: hashedPass })
}

export const updateStudentService = async (id, data) => {
  const user = await User.findById(id)
  if (!user) throw new Error("Student not found")

  if (data.image && user.image) {
    const filename = user.image.split("/uploads/")[1]
    if (filename) fs.unlink(`public/uploads/${filename}`, () => {})
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS)
  }

  return await User.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  })
}