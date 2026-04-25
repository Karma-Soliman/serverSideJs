import User from "../models/userModel.js"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import fs from "fs"

const SALT_ROUNDS = 10

export const findAllUsers = async () => {
  return await User.find({})
}

export const findUser = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid student ID")
  return await User.findById(id)
}

export const deleteStudentService = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid student ID")
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
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid student ID")
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

export const loginService = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error("User not found")
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error("Invalid password")
  return user
}