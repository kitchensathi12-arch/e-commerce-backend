import { deleteManyItem } from "@/services/cart.service";
import { createWishlistItem, deleteWishlistItem, findByWishlistItemUserAndProductId, getWishlistDetail } from "@/services/wishlist.service";
import { AsyncHandler } from "@/utils/AsyncHandler";
import { BadRequestError } from "@kitchensathi12-arch/ecommerce-types";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


export const addItem = AsyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const already = await findByWishlistItemUserAndProductId({ user_id: req.currentUser?.id!, product_id: data.product_id })
    if (already) {
        throw new BadRequestError("item already added", "addItem() method error")
    }
    const result = await createWishlistItem({ ...data, user_id: req.currentUser?.id });
    res.status(StatusCodes.CREATED).json({
        message: "Item added in wishlist successfully",
        data: result
    })
});

export const cartItem = AsyncHandler(async (req: Request, res: Response) => {
    const user_id = req.currentUser?.id;
    const result = await getWishlistDetail(user_id as string);
    res.status(StatusCodes.OK).json({
        message: "Item get from wishlist successfully",
        data: result
    });
});

export const deleteItem = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteWishlistItem(id as string);
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

