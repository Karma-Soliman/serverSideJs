const BACKEND_URL = "http://localhost:5500/api/students"

const fetchStudents = async () => {
  const response = await fetch(`${BACKEND_URL}`)
  if (!response.ok) throw new Error(`Server error: ${response.status}`)
  const data = await response.json()
  // support both array responses and { students: [...] } shaped responses
  return Array.isArray(data) ? data : data.students
}

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

const openModal = (student) => {
  document.getElementById("modal-avatar").textContent = getInitials(
    student.name,
  )
  document.getElementById("modal-name").textContent = student.name
  document.getElementById("modal-major").textContent = student.major
  document.getElementById("modal-email").textContent = student.email
  document.getElementById("modal-gpa").textContent =
    `GPA ${student.gpa.toFixed(1)}`
  document.getElementById("modal-overlay").removeAttribute("hidden")
}

const closeModal = () => {
  document.getElementById("modal-overlay").setAttribute("hidden", "")
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("modal-close").addEventListener("click", closeModal)
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal()
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal()
  })
  document.getElementById("add-student-btn").addEventListener("click", () => {
    const overlay = document.getElementById("modal-overlay")
    if (overlay.hasAttribute("hidden")) overlay.removeAttribute("hidden")
    else closeModal()
  })
})

const createCard = (student) => {
  const card = document.createElement("div")
  card.className = "card"
  card.style.cursor = "pointer"
  card.innerHTML = `
		<div class="card-avatar">${getInitials(student.name)}</div>
		<div class="card-name">${student.name}</div>
		<div class="card-major">${student.major}</div>
		<div class="card-email">${student.email}</div>
		<span class="card-gpa">GPA ${student.gpa.toFixed(1)}</span>
	`
  card.addEventListener("click", () => openModal(student))
  return card
}

const displayStudents = async () => {
  const studentList = document.getElementById("student-list")
  try {
    const students = await fetchStudents()
    if (!students) throw new Error("No students found")
    if (students.length === 0) throw new Error("No students found")
    studentList.innerHTML = ""
    students.forEach((student) => studentList.appendChild(createCard(student)))
  } catch (error) {
    studentList.innerHTML = `<p class="error">Could not load students: ${error.message}</p>`
    console.error("Error fetching students:", error)
  }
}

displayStudents()
