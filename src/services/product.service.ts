import mongoose from "mongoose";

// local imports 
import { ProductModel } from "@/models/product.model";
import { IProductDocument } from "@kitchensathi12-arch/ecommerce-types";
import { IProductList } from "@kitchensathi12-arch/ecommerce-types/src/interface/product.interface";



export const createProductService = async (data: IProductDocument): Promise<IProductDocument> => {
    const result = await ProductModel.create(data);
    return result;
};

export const getAllProductList = async (limit: number, skip: number, filter: any): Promise<{ data: IProductList[], totalProduct: number, totalPage: number }> => {
    const result = await ProductModel.aggregate([
        {
            $match: { ...filter, deleted_at: null }
        },
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
            }
        },
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: limit },
                ],
                totalProduct: [
                    { $count: "count" }
                ]
            }
        }
    ]);

    console.log(result)

    return { data: result[0].data, totalProduct: result[0]?.totalProduct[0]?.count, totalPage: Math.ceil(result[0]?.totalProduct[0]?.count / limit) }

};


export const getAllProductForWeb = async (
    limit: number,
    skip: number,
    filter: any
): Promise<{
    data: IProductList[],
    totalProduct: number,
    totalPage: number
}> => {

    let match: any = {
        deleted_at: null,
        active: true
    };

    // ✅ Category filter
    if (filter?.category?.length) {
        match.category = {
            $in: filter.category.map((id: string) => new mongoose.Types.ObjectId(id))
        };
    }

    // ✅ Brand filter
    if (filter?.brand?.length) {
        match.brand = {
            $in: filter.brand.map((id: string) => new mongoose.Types.ObjectId(id))
        };
    }

    // ✅ Price range filter (ONLY FILTER — not sorting)
    if (filter?.start_range !== undefined || filter?.end_range !== undefined) {
        match.product_selling_price = {};

        if (filter.start_range !== undefined) {
            match.product_selling_price.$gte = Number(filter.start_range);
        }

        if (filter.end_range !== undefined) {
            match.product_selling_price.$lte = Number(filter.end_range);
        }
    }

    // ✅ Sorting (ONLY SORT — independent)
    let sort: any = { createdAt: -1 };

    if (filter?.sort) {
        switch (filter.sort) {
            case "high-low":
                sort = { product_selling_price: -1 };
                break;

            case "low-high":
                sort = { product_selling_price: 1 };
                break;

            case "a-z":
                sort = { sort_name: 1 };
                break;

            case "z-a":
                sort = { sort_name: -1 };
                break;
        }
    }

    const result = await ProductModel.aggregate([

        { $match: match },

        // 🔗 Brand lookup
        {
            $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "brand",
                pipeline: [
                    { $project: { brand_name: 1 } }
                ]
            }
        },

        // 🔗 Category lookup
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
                pipeline: [
                    { $project: { name: 1, slug: 1 } }
                ]
            }
        },

        // 🧩 Flatten + sorting helper
        {
            $addFields: {
                category: { $arrayElemAt: ["$category", 0] },
                brand: { $arrayElemAt: ["$brand", 0] },
                product_images: { $arrayElemAt: ["$product_images", 0] },

                // ✅ Used ONLY for A-Z sorting
                sort_name: {
                    $toLower: {
                        $concat: [
                            { $ifNull: ["$product_name", ""] },
                            " ",
                            { $ifNull: ["$product_title", ""] }
                        ]
                    }
                }
            }
        },

        // 📦 Projection
        {
            $project: {
                product_name: 1,
                product_title: 1,
                product_slug: 1,
                product_images: 1,
                product_selling_price: 1,
                product_mrp_price: 1,
                product_discount: 1,
                category: 1,
                brand: 1
            }
        },

        // 📊 Pagination + Sorting
        {
            $facet: {
                data: [
                    { $sort: sort },   // ✅ sorting happens AFTER filtering
                    { $skip: skip },
                    { $limit: limit }
                ],
                totalProduct: [
                    { $count: "count" }
                ]
            }
        }

    ]);

    const totalProduct = result[0]?.totalProduct[0]?.count || 0;

    return {
        data: result[0]?.data || [],
        totalProduct,
        totalPage: Math.ceil(totalProduct / limit)
    };
};

export const getAllDeletedProductList = async (limit: number, skip: number, filter: any): Promise<{ data: IProductList[], totalProduct: number, totalPage: number }> => {
    const result = await ProductModel.aggregate([
        {
            $match: { ...filter, deleted_at: { $ne: null } }
        },
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
            }
        },
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: limit },
                ],
                totalProduct: [
                    { $count: "count" }
                ]
            }
        }
    ]);


    return { data: result[0].data, totalProduct: result[0]?.totalProduct[0]?.count, totalPage: Math.ceil(result[0]?.totalProduct[0]?.count / limit) }

};

export const getProductById = async (id:string): Promise<IProductList> => {
    const result = await ProductModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(id) }
        },
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
            }
        },
       
    ]);


    return result[0]
};

export const findProductWithProductSkuAndSlug = async (product_sku: string, product_slug: string): Promise<IProductDocument> => {
    const result = await ProductModel.findOne({ $or: [{ product_sku }, { product_slug }] }) as IProductDocument;
    return result;
};


export const updateProductById = async (id: string, data: any) => {
    const result = await ProductModel.findByIdAndUpdate(id, data);
    return result;
};
