import { Router } from "express";
import { loginUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
const userRouter=Router()
userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/refresh-token').post(refreshAccessToken)
export default userRouter