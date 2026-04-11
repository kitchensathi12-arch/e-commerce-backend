import { CartModel } from "@/models/cart.model";
import { ICartDocument } from "@kitchensathi12-arch/ecommerce-types";
import { Types } from "mongoose";



export const createCartItem = async (data: ICartDocument): Promise<ICartDocument> => {
    const result = await CartModel.create(data);
    return result;
};

export const getCartDetail = async (user_id: string): Promise<ICartDocument[]> => {
    const result = await CartModel.aggregate([
        {
            $match: { user_id: new Types.ObjectId(user_id) }
        },
        {
            $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product_id",
                pipeline: [
                    {
                        $lookup: {
                            from: "brands",
                            foreignField: "_id",
                            localField: "brand",
                            as: "brand",
                            pipeline: [
                                {
                                    $project: {
                                        brand_name: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: "categories",
                            foreignField: "_id",
                            localField: "category",
                            as: "category",
                            pipeline: [
                                {
                                    $project: {
                                        name: 1,
                                        slug: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            category: { $arrayElemAt: ["$category", 0] },
                            brand: { $arrayElemAt: ["$brand", 0] },
                            product_images: { $arrayElemAt: ["$product_images", 0] },
                        }
                    },
                ]
            }
        },
        {
            $addFields: {
                product_id: { $arrayElemAt: ["$product_id", 0] },

            }
        }
    ]);
    return result;
};

export const deleteCartItem = async (id: string): Promise<ICartDocument | null> => {
    const result = await CartModel.findByIdAndDelete(id);
    return result
};

export const deleteManyItem = async (id: string): Promise<unknown> => {
    const result = await CartModel.deleteMany({ user_id: id });
    return result;
};

export const findItemByProductIdAndUserId = async (data: { user_id: string, product_id: string }): Promise<ICartDocument | null> => {
    const result = await CartModel.findOne(data);
    return result
};




