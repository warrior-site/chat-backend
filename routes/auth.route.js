import express from "express"

import { register, verifyEmail, logout, login, checkAuth } from '../controllers/auth.controller.js'
import  verifyToken  from '../middleware/verifyToken.js'
const router = express.Router()

router.get("/check-auth",verifyToken,checkAuth)
router.post("/signup", register)
router.post("/verify-email", verifyEmail)
router.post("/logout", logout)
router.post("/login", login)
// router.post("/forgot-password", forgotPassword) // Uncomment when forgotPassword function is implemented




export default router
