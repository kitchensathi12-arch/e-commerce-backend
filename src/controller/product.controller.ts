import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuid } from "uuid";
import { BadRequestError, isBase64Image } from "@kitchensathi12-arch/ecommerce-types";

// ~ ---------------------- local imports start here ------------------------
import { createProductService, findProductWithProductSkuAndSlug, getAllDeletedProductList, getAllProductForWeb, getAllProductList, getProductById, updateProductById } from "@/services/product.service";
import { AsyncHandler } from "@/utils/AsyncHandler";
import { uploadImage } from "@/utils/imageHandler";


// local interface use only this file
interface IImageUpdate {
    image_url: string,
    image_public_id: string,
    image?: Base64URLString
}



// **************************************
// ~ this create product api is only admin panel.
// * here is create product code here.
// **************************************
export const createProduct = AsyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    const alreadyExist = await findProductWithProductSkuAndSlug(data.product_sku, data.product_slug);
    if (alreadyExist) {
        throw new BadRequestError("Product already exist with slug or sku", "createProduct() method error:")
    };

    if (data?.product_images && data?.product_images.length > 0) {
        data.product_images = await Promise.all(data?.product_images.map(async (item: Base64URLString) => {
            if (isBase64Image(item)) {
                const image_public_id = uuid();
                const response = await uploadImage(item, image_public_id, true, true);
                return { image_public_id, image_url: response?.secure_url };
            }
        }));
    }

    const result = await createProductService(data);
    res.status(StatusCodes.CREATED).json({
        message: "Product Created successfully",
        success: true,
        data: result
    })

});


// **************************************
// ~ this get product api is only admin panel.
// * here is get product code here.
// TODO : filter is remaining in this function.
// **************************************
export const getProductList = AsyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 12;
    const page = parseInt(req.query.limit as string) || 1;
    const skip = (page - 1) * limit;
    const filter = req.body?.filter || {};
    const data = await getAllProductList(limit, skip, filter);
    res.status(StatusCodes.OK).json(data)
});


// **************************************
// ~ this get product api is only use website.
//  * here is get product code here.
// **************************************
export const getProductListForWeb = AsyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 12;
    const page = parseInt(req.query.limit as string) || 1;
    const skip = (page - 1) * limit;
    const filter = req.body?.filter || {};
    const data = await getAllProductForWeb(limit, skip, filter);
    res.status(StatusCodes.OK).json(data);
});

// **************************************
// ~ this get product api is only use website.
//  * here is get product code here.
// **************************************

export const getProductDetailsForWeb = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await getProductById(id as string);
    res.status(StatusCodes.OK).json(data);
});


// **************************************
// ~ this get product api is only admin panel.
// * here is get product code here.
// TODO : filter is remaining in this function.
// **************************************
export const getDeletedProductList = AsyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 12;
    const page = parseInt(req.query.limit as string) || 1;
    const skip = (page - 1) * limit;
    const filter = req.body?.filter || {};
    const data = await getAllDeletedProductList(limit, skip, filter);
    res.status(StatusCodes.OK).json(data)
});

// **************************************
// ~ this delete product api is only use admin panel.
//  * here is delete product code here.
// **************************************
export const deleteProduct = AsyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params;

    const result = await updateProductById(id as string, { deleted_at: new Date() });
    if (!result) {
        throw new BadRequestError("data already deleted or not exist", "deleteProduct() method error");
    }
    res.status(StatusCodes.ACCEPTED).json({
        message: "Product deleted successfully",
    });
});


// **************************************
// ~ this restore product api is only use admin panel.
//  * here is restore product code here.
// **************************************
export const restoreProduct = AsyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params;

    const result = await updateProductById(id as string, { deleted_at: null });
    if (!result) {
        throw new BadRequestError("data already deleted or not exist", "deleteProduct() method error");
    }
    res.status(StatusCodes.ACCEPTED).json({
        message: "Product restored successfully",
    });
});


// **************************************
// ~ this update product api is only use admin panel.
//  * here is update product code here.
// **************************************
export const updateProduct = AsyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params;
    let data = req.body;

    const product = await getProductById(id as string);
    if (!product) {
        throw new BadRequestError("data already deleted or not exist", "deleteProduct() method error");
    }

    if (data?.product_images && data?.product_images?.length > 0) {

        const images = await Promise.all(data?.product_images?.map(async (item: IImageUpdate) => {
            if (item?.image && isBase64Image(item?.image!)) {
                const response = await uploadImage(item.image, item.image_public_id, true, true);
                return { image_public_id: item.image_public_id, image_url: response?.secure_url };
            } else {
                return { ...item }
            }
        }))
        data.product_images = images;
    }else {
        data.product_images = product.product_images;
    }

    
    const result = await updateProductById(id as string, data);
    if (!result) {
        throw new BadRequestError("data already deleted or not exist", "deleteProduct() method error");
    }
    res.status(StatusCodes.ACCEPTED).json({
        message: "Product deleted successfully",
    });
});