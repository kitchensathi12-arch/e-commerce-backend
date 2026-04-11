import { categoryValidationSchema } from "@kitchensathi12-arch/ecommerce-types";
import { Router } from "express";

// ~ ----------------------- local imports start here -----------------------------
import { createCategory, deleteCategories, getAllActiveCategories, getAllCategories, getAllDeletedCategories, restoredCategories, updateCategory } from "@/controller/category.controller";
import { authMiddleware } from "@/middleware/Authorization";
import { Validator } from "@/utils/validator";



export const categoryRoutes = (): Router => {
    const routes: Router = Router();


    // **************************************
    // ~ private and protected routes start here.
    // * this routes is only use admin panel.
    // **************************************
    routes.route("/create-category").post(authMiddleware, Validator(categoryValidationSchema), createCategory);
    routes.route("/get-category").get(authMiddleware, getAllCategories);
    routes.route("/delete-category/id/:id").delete(authMiddleware, deleteCategories);
    routes.route("/get-all-deleted-categories").get(authMiddleware, getAllDeletedCategories);
    routes.route("/update-category/id/:id").put(authMiddleware, updateCategory);
    routes.route("/restored-category/id/:id").put(authMiddleware, restoredCategories);


    // **************************************
    // ~ public routes start here.
    // * this routes is only website.
    // **************************************
    routes.route("/get-active-categories").get(getAllActiveCategories)


    return routes;
}