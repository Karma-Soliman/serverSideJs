const BASE_URL = "http://localhost:5500/api/students"

// If already logged in, skip the auth page
if (localStorage.getItem("token")) {
  window.location.href = "./students.html"
}

function switchTab(tab) {
  const isLogin = tab === "login"
  document.getElementById("login-form").hidden = !isLogin
  document.getElementById("signup-form").hidden = isLogin
  document.getElementById("tab-login").classList.toggle("active", isLogin)
  document.getElementById("tab-signup").classList.toggle("active", !isLogin)
}

const showError = (id, msg) => {
  const el = document.getElementById(id)
  el.textContent = msg
  el.hidden = false
}

const hideError = (id) => {
  document.getElementById(id).hidden = true
}

// update file input label when file is chosen
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("signup-image")
  fileInput.addEventListener("change", () => {
    const label = document.getElementById("file-label-text")
    label.textContent = fileInput.files[0]
      ? fileInput.files[0].name
      : "Choose a photo…"
  })

  // ── Login ────────────────────────────────────────────────────
  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault()
      hideError("login-error")

      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value

      try {
        const res = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Login failed")
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.user.id)
        window.location.href = "./students.html"
      } catch (err) {
        showError("login-error", err.message)
      }
    })

  // ── Signup ───────────────────────────────────────────────────
  document
    .getElementById("signup-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault()
      hideError("signup-error")

      const name = document.getElementById("signup-name").value
      const email = document.getElementById("signup-email").value
      const password = document.getElementById("signup-password").value
      const major = document.getElementById("signup-major").value
      const gpa = document.getElementById("signup-gpa").value
      const imageFile = document.getElementById("signup-image").files[0]

      // use FormData — backend uses multer (multipart/form-data)
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("major", major)
      formData.append("gpa", gpa)
      if (imageFile) formData.append("image", imageFile)

      try {
        const res = await fetch(`${BASE_URL}/signup`, {
          method: "POST",
          // no Content-Type header — browser sets it automatically with boundary
          body: formData,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Signup failed")
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.user.id)
        window.location.href = "./students.html"
      } catch (err) {
        showError("signup-error", err.message)
      }
    })
})
