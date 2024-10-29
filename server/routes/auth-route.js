const { Router } = require("express");
const { registerUser, loginUser, logoutUser, authMiddleware, getUserById } = require("../controllers/auth-controller");

const router = Router();

router.get("/getUserById/:userId", getUserById);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user",
    user
  })
})

module.exports = router;