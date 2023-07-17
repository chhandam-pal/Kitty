const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addInGroup,
  removeFromGroup,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameGroup);
router.put("/groupadd", protect, addInGroup);
router.put("/groupremove", protect, removeFromGroup);
// router.route("/group").post(protect,createGroupChat);
// router.route("/groupremove").put(protect, removeFromGroup);
// router.route("/groupadd").put(protect, AddInGroup);

module.exports = router;
