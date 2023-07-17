const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const router = express.Router();

router.get("/", protect, allUsers);
router.post("/", registerUser);
router.post("/login", authUser);

module.exports = router;
