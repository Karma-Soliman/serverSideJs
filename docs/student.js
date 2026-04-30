const BASE_URL = "http://localhost:5500/api/students"

// Guard: redirect to login if no token
const token = localStorage.getItem("token")
const currentUserId = localStorage.getItem("userId")
if (!token) window.location.href = "./index.html"

// ── Helpers ──────────────────────────────────────────────────────────
const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

const authHeaders = () => ({ Authorization: `Bearer ${token}` })

const handleUnauthorized = (res) => {
  if (res.status === 401) {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    window.location.href = "./index.html"
    return true
  }
  return false
}

// ── Avatar helper — image or initials ───────────────────────────────
const renderAvatar = (student, size = 48) => {
  if (student.image) {
    return `<img src="${student.image}" alt="${student.name || ""}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;" />`
  }
  return student.name ? getInitials(student.name) : "?"
}

// ── Card ─────────────────────────────────────────────────────────────
// studentListDTO: { id, name, image }
const createCard = (student) => {
  const card = document.createElement("div")
  card.className = "card"
  card.style.cursor = "pointer"
  const isOwn =
    student.id === currentUserId || String(student.id) === String(currentUserId)
  card.innerHTML = `
    <div class="card-avatar">${renderAvatar(student, 48)}</div>
    <div class="card-name">${student.name || "—"}</div>
    ${isOwn ? '<span class="card-own-badge">You</span>' : ""}
  `
  card.addEventListener("click", () => openModal(student))
  return card
}

// ── Modal — fetch full public profile on click ────────────────────────
// studentPublicDTO: { id, name, major, image }
let currentModalStudentId = null

const openModal = async (student) => {
  currentModalStudentId = student.id
  try {
    const res = await fetch(`${BASE_URL}/${student.id}`, {
      headers: authHeaders(),
    })
    if (handleUnauthorized(res)) return
    if (!res.ok) throw new Error("Could not load student")
    const full = await res.json() // studentPublicDTO: id, name, major, image

    const avatarEl = document.getElementById("modal-avatar")
    avatarEl.innerHTML = full.image
      ? `<img src="${full.image}" alt="${full.name || ""}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;" />`
      : getInitials(full.name || "?")

    document.getElementById("modal-name").textContent = full.name || "—"
    document.getElementById("modal-major").textContent = full.major || "—"
    document.getElementById("modal-gpa").textContent = "" // not in publicDTO

    // show edit/delete only if it's the logged in user's own card
    const isOwn = String(full.id) === String(currentUserId)
    const actions = document.getElementById("modal-actions")
    actions.hidden = !isOwn
    if (isOwn) actions.style.display = "flex"

    document.getElementById("modal-overlay").removeAttribute("hidden")
  } catch (err) {
    console.error("Failed to load student:", err)
  }
}

const closeModal = () => {
  document.getElementById("modal-overlay").setAttribute("hidden", "")
  currentModalStudentId = null
}

// ── Edit modal ───────────────────────────────────────────────────────
const openEditModal = () => {
  closeModal()
  document.getElementById("edit-overlay").removeAttribute("hidden")
}

const closeEditModal = () => {
  document.getElementById("edit-overlay").setAttribute("hidden", "")
}

// ── Delete ───────────────────────────────────────────────────────────
const deleteAccount = async () => {
  if (
    !confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    )
  )
    return
  try {
    const res = await fetch(`${BASE_URL}/${currentUserId}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
    if (!res.ok) throw new Error("Delete failed")
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    window.location.href = "./index.html"
  } catch (err) {
    alert(err.message)
  }
}

// ── Fetch & display students ─────────────────────────────────────────
const displayStudents = async () => {
  const studentList = document.getElementById("student-list")
  try {
    const res = await fetch(BASE_URL, { headers: authHeaders() })
    if (handleUnauthorized(res)) return
    if (!res.ok) throw new Error(`Server error: ${res.status}`)
    const data = await res.json()
    const students = Array.isArray(data) ? data : data.students
    if (!students || students.length === 0) {
      studentList.innerHTML = `<p class="error">No students found.</p>`
      return
    }
    studentList.innerHTML = ""
    students.forEach((s) => studentList.appendChild(createCard(s)))
  } catch (err) {
    studentList.innerHTML = `<p class="error">Could not load students: ${err.message}</p>`
  }
}

// ── Edit form submit ─────────────────────────────────────────────────
const handleEditSubmit = async (e) => {
  e.preventDefault()
  const errorEl = document.getElementById("edit-error")
  errorEl.hidden = true

  const formData = new FormData()
  const name = document.getElementById("edit-name").value
  const email = document.getElementById("edit-email").value
  const major = document.getElementById("edit-major").value
  const gpa = document.getElementById("edit-gpa").value
  const imageFile = document.getElementById("edit-image").files[0]

  if (name) formData.append("name", name)
  if (email) formData.append("email", email)
  if (major) formData.append("major", major)
  if (gpa) formData.append("gpa", gpa)
  if (imageFile) formData.append("image", imageFile)

  try {
    const res = await fetch(`${BASE_URL}/${currentUserId}`, {
      method: "PUT",
      headers: authHeaders(), // no Content-Type — multer needs multipart
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Update failed")
    closeEditModal()
    displayStudents() // refresh list
  } catch (err) {
    errorEl.textContent = err.message
    errorEl.hidden = false
  }
}

// ── Init ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    window.location.href = "./index.html"
  })

  // modal
  document.getElementById("modal-close").addEventListener("click", closeModal)
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal()
  })

  // edit/delete buttons inside modal
  document
    .getElementById("modal-edit-btn")
    .addEventListener("click", openEditModal)
  document
    .getElementById("modal-delete-btn")
    .addEventListener("click", deleteAccount)

  // edit modal
  document
    .getElementById("edit-close")
    .addEventListener("click", closeEditModal)
  document.getElementById("edit-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeEditModal()
  })
  document
    .getElementById("edit-form")
    .addEventListener("submit", handleEditSubmit)

  // file input label
  document.getElementById("edit-image").addEventListener("change", (e) => {
    const label = document.getElementById("edit-file-label-text")
    label.textContent = e.target.files[0]
      ? e.target.files[0].name
      : "Change photo…"
  })

  // escape key closes any open modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal()
      closeEditModal()
    }
  })

  displayStudents()
})
