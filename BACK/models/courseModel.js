import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: [1, "credits must be at least 1"],
      max: [10, "credits cannot exceed 10"],
    },
    instructor: {
      type: String,
      required: true,
    },
  },
    {
        timestamps: true,
    },
)

export default mongoose.model("Course", courseSchema);
