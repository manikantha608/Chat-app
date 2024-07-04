const express = require("express");
const {
  allMessages,
  sendMessage,
  deleteMessages
} = require("../Controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.route("/:chatId").delete(protect, deleteMessages);

module.exports = router;