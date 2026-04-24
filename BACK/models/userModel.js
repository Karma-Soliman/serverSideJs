import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gpa: {
      type: Number,
      required: true,
      min: [0, "GPA must be at least 0"],
      max: [4.0, "GPA cannot exceed 4.0"],
    },
    password: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      required: true,
    },
    image: {
        type: String,
            default: null
    },
  },
    {
        timestamps: true,
    },
)

export default mongoose.model("User", userSchema);