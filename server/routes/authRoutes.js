const router = require("express").Router();
const { signUp, login } = require("../controller/authController");

router.post("/sign-up", signUp);
router.post("/login", login);

module.exports = router;