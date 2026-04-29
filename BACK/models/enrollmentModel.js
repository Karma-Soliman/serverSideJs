import mongoose from "mongoose"

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      min: [0, "grade must be at least 0"],
        max: [20, "grade cannot exceed 20"],
      default: null,
    },
    status: {
        type: String,
        enam:["enrolled", "completed", "dropped"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

//prevent student from enrolling twice in the same course during the same sem
enrollmentSchema.index({ student: 1, course: 1, semester: 1 }, { unique: true })

export default mongoose.model("Enrollment", enrollmentSchema)
