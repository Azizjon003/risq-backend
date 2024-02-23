import { Router } from "express";

import { loginUser } from "../controllers/admin.controller";
import AuthMiddleware from "../middleware/auth.middleware";
import {
  deleteProduct,
  getOneProduct,
  getProducts,
  updateProduct,
} from "../controllers/products.controller";

const ProductsRoute = Router();

ProductsRoute.use(AuthMiddleware);
ProductsRoute.route("/").get(getProducts);
ProductsRoute.route("/:id")
  .get(getOneProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

export default ProductsRoute;
