import { students } from "../students.js"; 

export const getAllStudents = (req, res) => {
    res.status(200).json(students);
}; 