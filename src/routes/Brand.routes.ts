import { createBrandValidationSchema } from "@kitchensathi12-arch/ecommerce-types";
import { Router } from "express";

//  ~ ------------------------ local imports start here -------------------------------
import { createBrand, deleteBrand, getAllActiveBrand, getAllBrandsList, getDeletedBrand, restoreBrand, updateBrand } from "@/controller/brand.controller";
import { authMiddleware } from "@/middleware/Authorization";
import { Validator } from "@/utils/validator";

export const BrandRouter = (): Router => {
    const routes: Router = Router();

    // **************************************
    // ~ private and protected routes start here.
    // * this routes is only use admin panel.
    // **************************************
    routes.route("/create").post(authMiddleware, Validator(createBrandValidationSchema), createBrand);
    routes.route("/get-brands-list").post(authMiddleware, getAllBrandsList);
    routes.route("/get-deleted-brands").post(authMiddleware, getDeletedBrand);
    routes.route("/delete-brand/brandId/:id").delete(authMiddleware, deleteBrand);
    routes.route("/restore-brand/brandId/:id").post(authMiddleware, restoreBrand);
    routes.route("/update-brand/brandId/:id").put(authMiddleware, updateBrand);


    // **************************************
    // ~ public routes start here.
    // * this routes is only use website.
    // **************************************
    routes.route("/get-active-brand").get(getAllActiveBrand)

    return routes;
}




