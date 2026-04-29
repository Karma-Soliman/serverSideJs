export const validateCourse = (req, res, next) => {
  const { title, description, credits, instructor } = req.body

  const reject = (message) => res.status(400).json({ message })

  const isValidText = (val) => /^[a-zA-ZÀ-ÿ0-9\s',.\-:!?()]+$/.test(val.trim())
  const isValidName = (val) => /^[a-zA-ZÀ-ÿ\s'\-]+$/.test(val.trim())

  if (!title) return reject("Title is required")
  if (!isValidText(title)) return reject("Title contains invalid characters")
  if (title.trim().length < 3)
    return reject("Title must be at least 3 characters")

  if (!description) return reject("Description is required")
  if (!isValidText(description))
    return reject("Description contains invalid characters")
  if (description.trim().length < 10)
    return reject("Desciption must be at least 10 characters")

  if (!credits) return reject("Credits is required")
  if (credits < 1 || credits > 10)
    return reject("Credits must be between 1 and 10")
  if (!Number.isInteger(Number(credits)))
    return reject("Credits must be a whole number")

  if (!instructor) return reject("Instructor is required")
  if (!isValidName(instructor))
    return reject(
      "Instructor must contain only letters, spaces, hyphens, or apostrophes characters",
    )
  if (instructor.trim().length < 3)
    return reject("Instructor's name must be at least 3 characters")

  next()
}
