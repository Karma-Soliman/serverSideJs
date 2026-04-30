const API_URL = "http://localhost:5500/api"
const STUDENTS_URL = `${API_URL}/students`
const COURSES_URL = `${API_URL}/courses`
const ENROLLMENTS_URL = `${API_URL}/enrollments`

const token = localStorage.getItem("token")
const currentUserId = localStorage.getItem("userId")
if (!token) window.location.href = "./index.html"

let studentsCache = []
let coursesCache = []
let enrollmentsCache = []
let currentModalStudentId = null
let selectedStudentProfile = null

const getId = (item) => item?.id || item?._id
const authHeaders = () => ({ Authorization: `Bearer ${token}` })
const jsonHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
})

const handleUnauthorized = (res) => {
  if (res.status !== 401) return false
  localStorage.removeItem("token")
  localStorage.removeItem("userId")
  window.location.href = "./index.html"
  return true
}

const showError = (id, message) => {
  const el = document.getElementById(id)
  el.textContent = message
  el.hidden = false
}

const hideError = (id) => {
  document.getElementById(id).hidden = true
}

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?"

const renderAvatar = (student, size = 48) => {
  if (student.image) {
    return `<img src="${student.image}" alt="${student.name || ""}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;" />`
  }
  return getInitials(student.name)
}

const requestJson = async (url, options = {}) => {
  const res = await fetch(url, options)
  if (handleUnauthorized(res)) return null
  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.message || data?.error || `Server error: ${res.status}`)
  return data
}

const switchView = (view) => {
  document.querySelectorAll(".dashboard-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === view)
  })
  document.querySelectorAll(".dashboard-view").forEach((section) => {
    section.hidden = section.id !== `${view}-view`
  })
}

const createStudentCard = (student) => {
  const card = document.createElement("button")
  card.type = "button"
  card.className = "card resource-card"
  const isOwn = String(getId(student)) === String(currentUserId)
  card.innerHTML = `
    <div class="card-avatar">${renderAvatar(student, 48)}</div>
    <div class="card-name">${student.name || "-"}</div>
    ${isOwn ? '<span class="card-own-badge">You</span>' : ""}
  `
  card.addEventListener("click", () => openStudentModal(student))
  return card
}

const displayStudents = async () => {
  const studentList = document.getElementById("student-list")
  try {
    studentsCache = await requestJson(STUDENTS_URL, { headers: authHeaders() }) || []
    studentList.innerHTML = ""
    if (!studentsCache.length) {
      studentList.innerHTML = `<p class="error">No students found.</p>`
      return
    }
    studentsCache.forEach((student) => studentList.appendChild(createStudentCard(student)))
    fillEnrollmentSelects()
  } catch (err) {
    studentList.innerHTML = `<p class="error">Could not load students: ${err.message}</p>`
  }
}

const openStudentModal = async (student) => {
  currentModalStudentId = getId(student)
  try {
    const full = await requestJson(`${STUDENTS_URL}/${currentModalStudentId}`, {
      headers: authHeaders(),
    })
    if (!full) return
    selectedStudentProfile = full

    document.getElementById("modal-avatar").innerHTML = renderAvatar(full, 64)
    document.getElementById("modal-name").textContent = full.name || "-"
    document.getElementById("modal-major").textContent = full.major || "-"
    document.getElementById("modal-gpa").textContent = full.gpa ? `GPA ${full.gpa}` : ""

    const actions = document.getElementById("modal-actions")
    const note = document.getElementById("modal-note")
    const isOwn = String(currentModalStudentId) === String(currentUserId)
    actions.hidden = !isOwn
    actions.style.display = isOwn ? "flex" : "none"
    note.hidden = isOwn

    document.getElementById("modal-overlay").removeAttribute("hidden")
  } catch (err) {
    alert(err.message)
  }
}

const closeStudentModal = () => {
  document.getElementById("modal-overlay").setAttribute("hidden", "")
  currentModalStudentId = null
}

const openEditModal = () => {
  if (!selectedStudentProfile || String(getId(selectedStudentProfile)) !== String(currentUserId)) {
    alert("You can only edit your own account.")
    return
  }

  const placeholderFields = ["name", "email", "major", "gpa"]
  placeholderFields.forEach((field) => {
    const input = document.getElementById(`edit-${field}`)
    input.value = ""
    input.placeholder = selectedStudentProfile[field] ?? ""
  })
  document.getElementById("edit-image").value = ""
  document.getElementById("edit-file-label-text").textContent = "Change photo..."
  hideError("edit-error")

  closeStudentModal()
  document.getElementById("edit-overlay").removeAttribute("hidden")
}

const closeEditModal = () => {
  document.getElementById("edit-overlay").setAttribute("hidden", "")
}

const deleteAccount = async () => {
  if (String(currentModalStudentId) !== String(currentUserId)) {
    alert("You can only delete your own account.")
    return
  }
  if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return
  try {
    await requestJson(`${STUDENTS_URL}/${currentUserId}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    window.location.href = "./index.html"
  } catch (err) {
    alert(err.message)
  }
}

const handleEditSubmit = async (e) => {
  e.preventDefault()
  hideError("edit-error")

  const formData = new FormData()
  const fields = ["name", "email", "major", "gpa"]
  fields.forEach((field) => {
    const value = document.getElementById(`edit-${field}`).value
    if (value) formData.append(field, value)
  })

  const imageFile = document.getElementById("edit-image").files[0]
  if (imageFile) formData.append("image", imageFile)

  try {
    await requestJson(`${STUDENTS_URL}/${currentUserId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: formData,
    })
    closeEditModal()
    displayStudents()
  } catch (err) {
    showError("edit-error", err.message)
  }
}

const createCourseCard = (course) => {
  const id = getId(course)
  const card = document.createElement("article")
  card.className = "card resource-card"
  card.innerHTML = `
    <div class="resource-kicker">${course.credits} credits</div>
    <div class="card-name">${course.title || "-"}</div>
    <p class="resource-text">${course.description || "-"}</p>
    <p class="resource-meta">${course.instructor || "-"}</p>
    <div class="card-actions">
      <button class="btn-secondary" data-action="edit">Edit</button>
      <button class="btn-danger" data-action="delete">Delete</button>
    </div>
  `
  card.querySelector('[data-action="edit"]').addEventListener("click", () => startCourseEdit(course))
  card.querySelector('[data-action="delete"]').addEventListener("click", () => deleteCourse(id))
  return card
}

const displayCourses = async () => {
  const courseList = document.getElementById("course-list")
  try {
    coursesCache = await requestJson(COURSES_URL, { headers: authHeaders() }) || []
    courseList.innerHTML = ""
    if (!coursesCache.length) {
      courseList.innerHTML = `<p class="error">No courses found.</p>`
      fillEnrollmentSelects()
      return
    }
    coursesCache.forEach((course) => courseList.appendChild(createCourseCard(course)))
    fillEnrollmentSelects()
  } catch (err) {
    courseList.innerHTML = `<p class="error">Could not load courses: ${err.message}</p>`
  }
}

const resetCourseForm = () => {
  document.getElementById("course-form").reset()
  document.getElementById("course-id").value = ""
  document.getElementById("course-submit").textContent = "Create Course"
  document.getElementById("course-cancel").hidden = true
  hideError("course-error")
}

const startCourseEdit = (course) => {
  document.getElementById("course-id").value = getId(course)
  document.getElementById("course-title").value = course.title || ""
  document.getElementById("course-description").value = course.description || ""
  document.getElementById("course-credits").value = course.credits || ""
  document.getElementById("course-instructor").value = course.instructor || ""
  document.getElementById("course-submit").textContent = "Save Course"
  document.getElementById("course-cancel").hidden = false
  switchView("courses")
}

const handleCourseSubmit = async (e) => {
  e.preventDefault()
  hideError("course-error")

  const id = document.getElementById("course-id").value
  const payload = {
    title: document.getElementById("course-title").value.trim(),
    description: document.getElementById("course-description").value.trim(),
    credits: Number(document.getElementById("course-credits").value),
    instructor: document.getElementById("course-instructor").value.trim(),
  }

  try {
    await requestJson(id ? `${COURSES_URL}/${id}` : COURSES_URL, {
      method: id ? "PUT" : "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(payload),
    })
    resetCourseForm()
    displayCourses()
  } catch (err) {
    showError("course-error", err.message)
  }
}

const deleteCourse = async (id) => {
  if (!confirm("Delete this course?")) return
  try {
    await requestJson(`${COURSES_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
    displayCourses()
    displayEnrollments()
  } catch (err) {
    alert(err.message)
  }
}

const fillEnrollmentSelects = () => {
  const studentSelect = document.getElementById("enrollment-student")
  const courseSelect = document.getElementById("enrollment-course")
  if (!studentSelect || !courseSelect) return

  studentSelect.innerHTML = `<option value="">Select a student</option>`
  courseSelect.innerHTML = `<option value="">Select a course</option>`

  studentsCache.forEach((student) => {
    const option = document.createElement("option")
    option.value = getId(student)
    option.textContent = student.name || getId(student)
    studentSelect.appendChild(option)
  })

  coursesCache.forEach((course) => {
    const option = document.createElement("option")
    option.value = getId(course)
    option.textContent = course.title || getId(course)
    courseSelect.appendChild(option)
  })
}

const refName = (ref, fallback = "-") => {
  if (!ref) return fallback
  if (typeof ref === "string") return ref
  return ref.name || ref.title || getId(ref) || fallback
}

const createEnrollmentRow = (enrollment) => {
  const id = getId(enrollment)
  const row = document.createElement("article")
  row.className = "resource-row"
  row.innerHTML = `
    <div>
      <div class="card-name">${refName(enrollment.student)} → ${refName(enrollment.course)}</div>
      <p class="resource-meta">${enrollment.semester || "-"} · ${enrollment.status || "-"}</p>
    </div>
    <div class="resource-grade">${enrollment.grade ?? "No grade"}</div>
    <div class="card-actions">
      <button class="btn-secondary" data-action="edit">Edit</button>
      <button class="btn-danger" data-action="delete">Delete</button>
    </div>
  `
  row.querySelector('[data-action="edit"]').addEventListener("click", () => startEnrollmentEdit(enrollment))
  row.querySelector('[data-action="delete"]').addEventListener("click", () => deleteEnrollment(id))
  return row
}

const displayEnrollments = async () => {
  const enrollmentList = document.getElementById("enrollment-list")
  try {
    enrollmentsCache = await requestJson(ENROLLMENTS_URL, { headers: authHeaders() }) || []
    enrollmentList.innerHTML = ""
    if (!enrollmentsCache.length) {
      enrollmentList.innerHTML = `<p class="error">No enrollments found.</p>`
      return
    }
    enrollmentsCache.forEach((enrollment) => {
      enrollmentList.appendChild(createEnrollmentRow(enrollment))
    })
  } catch (err) {
    enrollmentList.innerHTML = `<p class="error">Could not load enrollments: ${err.message}</p>`
  }
}

const resetEnrollmentForm = () => {
  document.getElementById("enrollment-form").reset()
  document.getElementById("enrollment-id").value = ""
  document.getElementById("enrollment-student").disabled = false
  document.getElementById("enrollment-course").disabled = false
  document.getElementById("enrollment-submit").textContent = "Create Enrollment"
  document.getElementById("enrollment-cancel").hidden = true
  hideError("enrollment-error")
}

const startEnrollmentEdit = (enrollment) => {
  document.getElementById("enrollment-id").value = getId(enrollment)
  document.getElementById("enrollment-student").value = getId(enrollment.student) || enrollment.student || ""
  document.getElementById("enrollment-course").value = getId(enrollment.course) || enrollment.course || ""
  document.getElementById("enrollment-semester").value = enrollment.semester || ""
  document.getElementById("enrollment-grade").value = enrollment.grade ?? ""
  document.getElementById("enrollment-status").value = enrollment.status || "enrolled"
  document.getElementById("enrollment-student").disabled = true
  document.getElementById("enrollment-course").disabled = true
  document.getElementById("enrollment-submit").textContent = "Save Enrollment"
  document.getElementById("enrollment-cancel").hidden = false
  switchView("enrollments")
}

const handleEnrollmentSubmit = async (e) => {
  e.preventDefault()
  hideError("enrollment-error")

  const id = document.getElementById("enrollment-id").value
  const grade = document.getElementById("enrollment-grade").value
  const payload = {
    semester: document.getElementById("enrollment-semester").value.trim(),
    status: document.getElementById("enrollment-status").value,
    ...(grade !== "" && { grade: Number(grade) }),
  }

  if (!id) {
    payload.student = document.getElementById("enrollment-student").value
    payload.course = document.getElementById("enrollment-course").value
  }

  try {
    await requestJson(id ? `${ENROLLMENTS_URL}/${id}` : ENROLLMENTS_URL, {
      method: id ? "PUT" : "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(payload),
    })
    resetEnrollmentForm()
    displayEnrollments()
  } catch (err) {
    showError("enrollment-error", err.message)
  }
}

const deleteEnrollment = async (id) => {
  if (!confirm("Delete this enrollment?")) return
  try {
    await requestJson(`${ENROLLMENTS_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
    displayEnrollments()
  } catch (err) {
    alert(err.message)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    window.location.href = "./index.html"
  })

  document.querySelectorAll(".dashboard-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view))
  })

  document.getElementById("modal-close").addEventListener("click", closeStudentModal)
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeStudentModal()
  })
  document.getElementById("modal-edit-btn").addEventListener("click", openEditModal)
  document.getElementById("modal-delete-btn").addEventListener("click", deleteAccount)

  document.getElementById("edit-close").addEventListener("click", closeEditModal)
  document.getElementById("edit-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeEditModal()
  })
  document.getElementById("edit-form").addEventListener("submit", handleEditSubmit)
  document.getElementById("edit-image").addEventListener("change", (e) => {
    document.getElementById("edit-file-label-text").textContent = e.target.files[0]
      ? e.target.files[0].name
      : "Change photo..."
  })

  document.getElementById("course-form").addEventListener("submit", handleCourseSubmit)
  document.getElementById("course-cancel").addEventListener("click", resetCourseForm)
  document.getElementById("enrollment-form").addEventListener("submit", handleEnrollmentSubmit)
  document.getElementById("enrollment-cancel").addEventListener("click", resetEnrollmentForm)

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeStudentModal()
      closeEditModal()
    }
  })

  displayStudents()
  displayCourses()
  displayEnrollments()
})
