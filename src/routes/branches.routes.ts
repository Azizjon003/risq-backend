import { Router } from "express";

import AuthMiddleware from "../middleware/auth.middleware";
import {
  getBranches,
  getOneBranch,
  getOrderBranches,
  getOrderProducts,
} from "../controllers/branches.controller";

const BranchesRoute = Router();

BranchesRoute.use(AuthMiddleware);
BranchesRoute.route("/").get(getBranches);
BranchesRoute.get("/products/:id", getOrderProducts);
BranchesRoute.get("/orders/:id", getOrderBranches);
BranchesRoute.route("/:id").get(getOneBranch);

export default BranchesRoute;
