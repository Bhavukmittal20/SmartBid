import { Router } from "express";
import { fetchUser, loginUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter=Router()
userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/refresh-token').post(refreshAccessToken);
userRouter.route('/get-details').get(verifyJWT,fetchUser);
export default userRouter