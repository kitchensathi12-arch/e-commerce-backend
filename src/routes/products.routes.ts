import { createProductValidation } from "@kitchensathi12-arch/ecommerce-types";
import { Router } from "express";

// ~ ------------------- local imports start here ----------------------
import { createProduct, deleteProduct, getDeletedProductList, getProductDetailsForWeb, getProductList, getProductListForWeb, restoreProduct, updateProduct } from "@/controller/product.controller";
import { authMiddleware } from "@/middleware/Authorization";
import { Validator } from "@/utils/validator";


export const productRoutes = (): Router => {
    const routes: Router = Router();

    // **************************************
    // ~ private and protected routes start here.
    // * this routes is only use admin panel.
    // **************************************
    routes.route("/create-product").post(authMiddleware, Validator(createProductValidation), createProduct);
    routes.route("/get-product-list").post(authMiddleware, getProductList);
    routes.route("/get-deleted-product-list").post(authMiddleware, getDeletedProductList);
    routes.route("/delete-product/product-id/:id").delete(authMiddleware,deleteProduct),
    routes.route("/restore-product/product-id/:id").patch(authMiddleware,restoreProduct),
    routes.route("/update-product/product-id/:id").put(authMiddleware,updateProduct),

    // **************************************
    // ~ public routes start here.
    // * this routes is only use website.
    // **************************************
    routes.route("/get-all-products").post(getProductListForWeb);
    routes.route("/get-product-details/product-id/:id").get(getProductDetailsForWeb);


    return routes;
}