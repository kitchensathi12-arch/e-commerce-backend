import { BadRequestError } from "@kitchensathi12-arch/ecommerce-types";
import { UploadApiResponse } from "cloudinary";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuid } from "uuid";

// ~ ------------local imports start here ---------
import { createBannerService, deleteBannerService, findBannerById, findBannerByTitle, getActiveBannersService, getAllBannersWithPagination, updateBannerService } from "@/services/banner.service";
import { AsyncHandler } from "@/utils/AsyncHandler";
import { uploadImage } from "@/utils/imageHandler";


// **************************************
// ~ this api is use only for admin panel.
// * this method is create banner.
// **************************************
export const createBanner = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = req.body;

    const existBanner = await findBannerByTitle(data.title);

    if (existBanner) {
        throw new BadRequestError("Banner title already exist user different", "createBanner() method error:")
    }

    const image_public_id = uuid();
    const image = await uploadImage(data.image, image_public_id, true, true) as UploadApiResponse;

    const result = await createBannerService({ ...data, image_public_id, image: image ? image.secure_url : null });
    res.status(StatusCodes.CREATED).json({
        message: "Banner added successfully",
        data: result
    });
});


// **************************************
// ~ this api is use only website.
// * this method is get only active banner.
// **************************************
export const getActiveBanner = AsyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const data = await getActiveBannersService();
    res.status(StatusCodes.OK).json({
        message: "Active banners",
        data
    })
});


// **************************************
// ~ this api is use only for admin panel.
// * this method is get all banner to show all the data in admin panel.
// **************************************
export const getAllBannerData = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip: number = (page - 1) * limit;
    const data = await getAllBannersWithPagination(skip, limit);
    res.status(StatusCodes.OK).json(data)
});

// **************************************
// ~ this api is use only for admin panel.
// * this method is delete banner and admin can only delete banner.
// **************************************
export const deleteBannerData = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const data = await deleteBannerService(id as string);
    if (!data) {
        throw new BadRequestError("Banner already deleted", "deleteBannerData() method error");
    }
    res.status(StatusCodes.OK).json({
        message: "Banner deleted Successfully",
        data
    })
});


// **************************************
// ~ this api is use only for admin panel.
// * this method is update banner.
// **************************************
export const updateBannerData = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    const { id } = req.params;

    const exist = await findBannerById(id as string);
    if (!exist) {
        throw new BadRequestError("Banner does not exist user different", "updateBannerData() method error:")
    }

    const image = await uploadImage(data.image, exist.image_public_id, true, true) as UploadApiResponse;

    const result = await updateBannerService(id as string, { ...data, image: image ? image.secure_url : null });
    res.status(StatusCodes.CREATED).json({
        message: "Banner added successfully",
        data: result
    });
});