import { Router } from "express";

import { getMe, loginUser } from "../controllers/admin.controller";

const userRoute = Router();

userRoute.post("/login", loginUser);
userRoute.get("/me", getMe);
export default userRoute;
