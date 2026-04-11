import { addItem, cartItem, deleteItem, emptyCart } from "@/controller/cart.controller";
import { Validator } from "@/utils/validator";
import { cartValidationSchema } from "@kitchensathi12-arch/ecommerce-types";
import { Router } from "express";



export const cartRoutes = ():Router => {
    const routes:Router = Router();
    routes.route("/add-item").post(Validator(cartValidationSchema),addItem);
    routes.route("/cart-items").get(cartItem);
    routes.route("/remove-items/cart-id/:id").delete(deleteItem);
    routes.route("/empty-cart").delete(emptyCart);
    
    
    
    return routes;
}

