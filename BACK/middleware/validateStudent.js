import fs from "fs"

export const validateStudent = (req, res, next) => {
    console.log("req.body:", req.body) // ← add this
    console.log("req.file:", req.file)
  const { name, email, password, gpa, major } = req.body

  const reject = (message) => {
    if (req.file) fs.unlink(req.file.path, () => {})
    return res.status(400).json({ message })
  }

  if (!name) return reject("Name is required")
  if (!email) return reject("Email is required")
  if (!password) return reject("Password is required")
  if (!gpa) return reject("GPA is required")
  if (!major) return reject("Major is required")
  if (password.length < 8)
    return reject("Password must be at least 8 characters long")
  if (gpa < 0 || gpa > 4) return reject("GPA must be between 0 and 4")

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return reject("Email is not valid")

  next()
}