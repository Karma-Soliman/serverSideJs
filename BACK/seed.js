import { connectToMongoDB } from "./config/db.js"
import User from "./models/userModel.js"
import mongoose from "mongoose"
await connectToMongoDB();

await User.deleteMany({})

await User.insertMany([
  {
    name: "Alice Martin",
    email: "alice.martin@epita.fr",
    major: "Computer Science",
    gpa: 3.8,
    password: "password123",
  },
  {
    name: "Bob Dupont",
    email: "bob.dupont@epita.fr",
    major: "Computer Science",
    gpa: 3.5,
    password: "password123",
  },
  {
    name: "Clara Rousseau",
    email: "clara.rousseau@epita.fr",
    major: "Computer Science",
    gpa: 3.9,
    password: "password123",
  },
])

console.log("Database seeded")
await mongoose.disconnect()
