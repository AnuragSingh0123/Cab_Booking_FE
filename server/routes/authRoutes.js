const router = require("express").Router();
const { signUp, login, getMe, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/sign-up", signUp);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", logout);

module.exports = router;