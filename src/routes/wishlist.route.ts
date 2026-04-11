import { addItem, cartItem, deleteItem, emptyCart } from "@/controller/wishlist.controller";
import { Validator } from "@/utils/validator";
import { wishlistValidationSchema } from "@kitchensathi12-arch/ecommerce-types";
import { Router } from "express";



export const wishlistRoutes = (): Router => {
    const routes: Router = Router();

    routes.route("/add-item").post(Validator(wishlistValidationSchema), addItem);
    routes.route("/wishlist-items").get(cartItem);
    routes.route("/remove-items/wishlist-id/:id").delete(deleteItem);
    routes.route("/empty-wishlist").delete(emptyCart);

    return routes;
};

