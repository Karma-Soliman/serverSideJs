//full profile
export const toStudentDTO = (student) => ({
  id: student._id,
  name: student.name,
  email: student.email,
  major: student.major,
  gpa: student.gpa,
  image: student.image ?? null,
})

//lists
export const studentListDTO = (student) => ({
  id: student._id,
  name: student.name,
  image: student.image ?? null,
})

//public profile
export const studentPublicDTO = (student) => ({
  id: student._id,
  name: student.name,
  major: student.major,
  image: student.image ?? null,
})
