import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuid } from "uuid";
import { BadRequestError, isBase64Image } from "@kitchensathi12-arch/ecommerce-types";

// ~ ----------------------- local import start here -------------------------
import { createCategoryService, deleteCategoryService, findCategoryById, findCategoryBySlug, getActiveCategoryService, getAlldeletedCategoriesService, getCategoryServerService, updateCategoryService } from "@/services/category.service";
import { AsyncHandler } from "@/utils/AsyncHandler";
import { uploadImage } from "@/utils/imageHandler";


// **************************************
// ~ this create category api is only use admin panel.
// * create category function start here.
// **************************************
export const createCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = req.body;

    const slugExist = await findCategoryBySlug(data?.slug);

    if (slugExist) {
        throw new BadRequestError("slug is already exist", "createCategory() method error")
    }
    let image;
    const image_public_id = uuid();
    if (data?.image) {
        image = await uploadImage(data.image, image_public_id, true, true);
    };

    const result = await createCategoryService({ ...data, image: image?.secure_url });

    res.status(StatusCodes.CREATED).json({
        message: "Category created successfully",
        data: result
    })
});

// **************************************
// ~ this get all category api is only use admin panel.
// * get all category function start here.
// **************************************
export const getAllCategories = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { query } = req;

    const page: number = query?.page ? parseInt(query?.page as string) : 1;
    const limit: number = query?.limit ? parseInt(query?.limit as string) : 10;
    const skip: number = (page - 1) * limit;

    const data = await getCategoryServerService(limit, skip);

    res.status(StatusCodes.OK).json(data)

});

// **************************************
// ~ this delete category api is only use admin panel.
// * delete category function start here.
// **************************************
export const deleteCategories = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await deleteCategoryService(id as string, Date.now());
    if (!result) {
        throw new BadRequestError("category not deleted try again", "deleteCategories() method error");
    };
    res.status(StatusCodes.OK).json({ message: "Category deleted successfully", data: result })
});
// **************************************
// ~ this get all deleted category api is only use admin panel.
// * get all deleted category function start here.
// **************************************
export const getAllDeletedCategories = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { query } = req;
    const page: number = query?.page ? parseInt(query?.page as string) : 1;
    const limit: number = query?.limit ? parseInt(query?.limit as string) : 10;
    const skip: number = (page - 1) * limit;
    const data = await getAlldeletedCategoriesService(limit, skip);
    res.status(StatusCodes.OK).json(data);
});
// **************************************
// ~ this update category api is only use admin panel.
// * update category function start here.
// **************************************
export const updateCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body;
    const existSlug = await findCategoryBySlug(data?.slug);
    if (existSlug && (existSlug?._id)?.toString() !== id?.toString()) {
        throw new BadRequestError("Slug is already in used", "updateCategory() method error");
    };

    const oldCategory = await findCategoryById(id as string);

    let image;
    if (data?.image && isBase64Image(data?.image)) {
        image = await uploadImage(data?.image, oldCategory.image_public_id, true, true)
    };


    const result = await updateCategoryService(id as string, { ...data, image: image?.secure_url || existSlug.image });

    res.status(StatusCodes.OK).json({
        message: "Category updated successfully",
        data: result
    })
});

// **************************************
// ~ this restore category api is only use admin panel.
// * restore category function start here.
// **************************************
export const restoredCategories = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await deleteCategoryService(id as string, "");
    if (!result) {
        throw new BadRequestError("category not deleted try again", "deleteCategories() method error");
    };
    res.status(StatusCodes.OK).json({ message: "Category restored successfully", data: result })
});

// **************************************
// ~ this get all active category api is only use website.
// * create get all active function start here.
// **************************************
export const getAllActiveCategories = AsyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const data = await getActiveCategoryService();
    res.status(StatusCodes.OK).json(data)
});