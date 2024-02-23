import { Router } from "express";
import userRoute from "./user.routes";
import errorMiddleware from "../middleware/errorMiddleware";
import ProductsRoute from "./products.routes";
import BranchesRoute from "./branches.routes";
const mainRouter = Router();

mainRouter.use("/user", userRoute);
mainRouter.use("/product", ProductsRoute);
mainRouter.use("/branches", BranchesRoute);
export default mainRouter;
