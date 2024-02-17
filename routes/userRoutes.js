const express = require("express");
const {
  handleUserRegister,
  handleGetAllUsers,
  handleGetUser,
  handleUpdateUser,
  handleDeleteUser,
  handleUserStatus,
  handleExportCsv,
} = require("../controllers/userControllers");
const router = express.Router();
const upload = require("../multerConfig/storageConfig");

// All routes
router.post(
  "/user/register",
  upload.single("user_profile"),
  handleUserRegister
);

router.get("/users", handleGetAllUsers);
router.get("/user/:id", handleGetUser);
router.put("/user/edit/:id", upload.single("user_profile"), handleUpdateUser);
router.delete("/user/delete/:id", handleDeleteUser);
router.put("/user/status/:id", handleUserStatus);
router.get("/userexport", handleExportCsv);

module.exports = router;
