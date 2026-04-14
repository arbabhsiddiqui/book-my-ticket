import { Router } from "express";
import * as controller from "./auth.controller.js";
import validate from "../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";
// import { authenticate } from "./auth.middleware.js";
// import ForgotDto from "./dto/forgot.dto.js";
// import ResetPasswordDto from "./dto/resetPassword.dto.js";
// import ChangePasswordDto from "./dto/changePassword.dto.js";

const router = Router();

router.post("/register", validate(RegisterDto), controller.register);
router.post("/login", validate(LoginDto), controller.login);
// router.post("/logout", authenticate, controller.logout);
// router.get("/me", authenticate, controller.getMe);
// router.get("/verify-email/:token", controller.verifyEmail);
// router.post("/forgot-password", validate(ForgotDto), controller.forgotPassword);
// router.post("/reset-password", validate(ResetPasswordDto), controller.resetPassword);
// router.post("/change-password", authenticate, validate(ChangePasswordDto), controller.changePassword);



export default router