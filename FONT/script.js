const BACKEND_URL = "http://localhost:5500"

const fetchStudents = async () => {
	const response = await fetch(`${BACKEND_URL}/students`)
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

const createCard = (student) => {
	const card = document.createElement("div")
	card.className = "card"
	card.innerHTML = `
		<div class="card-avatar">${getInitials(student.name)}</div>
		<div class="card-name">${student.name}</div>
		<div class="card-major">${student.major}</div>
		<div class="card-email">${student.email}</div>
		<span class="card-gpa">GPA ${student.gpa.toFixed(1)}</span>
	`
	return card
}

const displayStudents = async () => {
	const studentList = document.getElementById("student-list")
	try {
		const students = await fetchStudents()
		studentList.innerHTML = ""
		students.forEach((student) => studentList.appendChild(createCard(student)))
	} catch (error) {
		studentList.innerHTML = `<p class="error">Could not load students: ${error.message}</p>`
		console.error("Error fetching students:", error)
	}
}

displayStudents()
