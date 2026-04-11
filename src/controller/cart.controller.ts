import { createCartItem, deleteCartItem, deleteManyItem, findItemByProductIdAndUserId, getCartDetail } from "@/services/cart.service";
import { AsyncHandler } from "@/utils/AsyncHandler";
import { BadRequestError } from "@kitchensathi12-arch/ecommerce-types";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


export const addItem = AsyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const already = await findItemByProductIdAndUserId({ user_id: req.currentUser?.id!, product_id: data.product_id })
    if (already) {
        throw new BadRequestError("item already added", "addItem() method error")
    }
    const result = await createCartItem({ ...data, user_id: req.currentUser?.id });
    res.status(StatusCodes.CREATED).json({
        message: "Item added in cart successfully",
        data: result
    })
});

export const cartItem = AsyncHandler(async (req: Request, res: Response) => {
    const user_id = req.currentUser?.id;
    const result = await getCartDetail(user_id as string);
    res.status(StatusCodes.OK).json({
        message: "Item get successfully",
        data: result
    });
});

export const deleteItem = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteCartItem(id as string);
    res.status(StatusCodes.OK).json({
        message: "Item removed successfully",
        data: result
    });
});

export const emptyCart = AsyncHandler(async (req: Request, res: Response) => {
    const user_id = req.currentUser?.id;
    const result = await deleteManyItem(user_id as string);
    res.status(StatusCodes.OK).json({
        message: "Item removed successfully",
        data: result
    });
});

