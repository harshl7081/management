const { Router } = require("express");
const { body } = require("express-validator");
// const { inputErrorHandler } = require("./Module/middleware");
const { protect } = require("./Module/auth");
const {
  getAllProjects,
  getoneProject,
  createProject,
  updateProject,
  deleteProject,
} = require("./Handlers/Project");

const router = Router();

router.get("/getallprojects", getAllProjects);

router.get("/project/:id", getoneProject);

router.post(
  "/project",
  [
    body("student_name").notEmpty().withMessage("Student name is required"),
    body("student_id").notEmpty().withMessage("Student ID is required"),
    body("project_name").notEmpty().withMessage("Project name is required"),
    body("project_category")
      .notEmpty()
      .withMessage("Project category is required"),
    body("project_description")
      .notEmpty()
      .withMessage("Project description is required"),
    body("faculty_name").notEmpty().withMessage("Faculty name is required"),
    body("project_link").optional(),
    body("ppt_url").optional(),
  ],
  // inputErrorHandler,
  protect,
  createProject
);

router.put(
  "/project/:id",  
  // inputErrorHandler,
  protect,
  updateProject
);

router.delete("/project/:id", protect, deleteProject);

module.exports = router;
