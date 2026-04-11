import { bannerValidationSchema } from "@kitchensathi12-arch/ecommerce-types";
import express, { Router } from "express";

// ~ -------------------- local imports start here ---------------------
import { createBanner, deleteBannerData, getActiveBanner, getAllBannerData, updateBannerData } from "@/controller/banner.controller";
import { authMiddleware } from "@/middleware/Authorization";
import { Validator } from "@/utils/validator";


export const bannerRoutes = (): Router => {
    const routes: Router = express.Router();

    // **************************************
    // ~ private and protected routes start here.
    // * this routes is only use admin panel.
    // **************************************
    routes.post("/create", authMiddleware, Validator(bannerValidationSchema), createBanner);
    routes.get("/get-all-banners", authMiddleware, getAllBannerData);
    routes.delete("/delete/id/:id", authMiddleware, deleteBannerData);
    routes.put("/update/id/:id", authMiddleware, updateBannerData);


    // **************************************
    // ~ public routes start here.
    // * this routes is only use website.
    // **************************************
    routes.get("/active-banners", getActiveBanner);

    return routes;
};