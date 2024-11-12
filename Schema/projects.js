const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  student_name: {
    type: String,
    required: true,
  },
  student_id: {
    type: String,
    required: true,
  },
  project_name: {
    type: String,
    required: true,
  },
  project_category: {
    type: String,
    required: true,
  },
  project_description: {
    type: String,
    required: true,
  },
  project_link: {
    type: String,
  },
  faculty_name: {
    type: String,
    required: true,
  },
  ppt_url: {
    type: [String],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("project_collections", projectSchema);

module.exports = Project;
