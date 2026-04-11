import {Router} from "express";
import { AuthRouter } from "@/routes/auth.routes";
import { bannerRoutes } from "@/routes/banner.routes";
import { categoryRoutes } from "@/routes/category.routes";
import { BrandRouter } from "@/routes/Brand.routes";
import { productRoutes } from "@/routes/products.routes";
import { cartRoutes } from "@/routes/cart.route";
import { wishlistRoutes } from "@/routes/wishlist.route";
import { authMiddleware } from "@/middleware/Authorization";
import { addressRoutes } from "@/routes/address.route";

export const RootRouter = ():Router => {
    const router:Router = Router();
    router.use("/auth",AuthRouter());
    router.use("/banner",bannerRoutes());
    router.use("/category",categoryRoutes());
    router.use("/brand",BrandRouter());
    router.use("/product",productRoutes());
    router.use("/cart",authMiddleware,cartRoutes());
    router.use("/wishlist",authMiddleware,wishlistRoutes());
    router.use("/address",authMiddleware,addressRoutes());


    return router;
}