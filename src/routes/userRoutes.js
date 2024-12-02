import { Router } from "express";
import userController from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login);
userRoutes.post("/forgotpassword", userController.forgotPassword);

export default userRoutes;
