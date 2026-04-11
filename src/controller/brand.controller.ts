import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuid } from "uuid";
import { BadRequestError, isBase64Image } from "@kitchensathi12-arch/ecommerce-types";

// ~ ----------------- local imports start here ----------------------
import { createBrandService, deleteBrandById, findBrandByNameOrSlug, getActiveBrand, getBrandById, getdeletdBrand, paginateWithFilterBrand, updateBrandById } from "@/services/brand.service";
import { AsyncHandler } from "@/utils/AsyncHandler";
import { uploadImage } from "@/utils/imageHandler";


// **************************************
// ~ this create brand api is only use admin panel.
// * create brand function start here.
// **************************************
export const createBrand = AsyncHandler(async (req: Request, res: Response) => {
    let data = req.body;

    const exist = await findBrandByNameOrSlug(data?.brand_name, data?.slug);
    if (exist) {
        throw new BadRequestError("Brand is already exist user another keyword", "createBrand() method error :")
    }

    //  ------------------ here i publish certificate ---------------------
    if (data?.certificate) {
        const certificate_public_id = uuid();
        const certificateResponse = await uploadImage(data?.certificate, certificate_public_id, true, true);
        data.certificate_public_id = certificate_public_id;
        data.certificate = certificateResponse?.secure_url;
    };

    //  ------------------ here i publish logo ----------------
    if (data?.brand_logo) {
        const brand_logo_public_id = uuid();
        const brandLogoResponse = await uploadImage(data?.brand_logo, brand_logo_public_id, true, true);
        data.brand_logo_public_id = brand_logo_public_id;
        data.brand_logo = brandLogoResponse?.secure_url;
    };

    const result = await createBrandService(data);

    res.status(StatusCodes.CREATED).json({
        message: "Brand register successfully",
        data: result
    })

});

// **************************************
// ~ get all brands api is only use admin panel.
// * get all brands list function start here.
// **************************************
export const getAllBrandsList = AsyncHandler(async (req: Request, res: Response) => {
    const query = req.query;
    const page = parseInt(query?.page as string) || 1;
    const limit = parseInt(query?.limit as string) || 10;
    const filter = req.body?.filter || {};
    const skip = (page - 1) * limit;
    const data = await paginateWithFilterBrand(limit, skip, filter);
    res.status(StatusCodes.OK).json(data)
});

// **************************************
// ~ deleted brands api is only use admin panel.
// * deleted brands list function start here.
// **************************************
export const deleteBrand = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await deleteBrandById(id as string);
    res.status(StatusCodes.OK).json({ message: "Brand deleted successfully", data })
});

// **************************************
// ~ this restore brands api is only use admin panel.
// * restore brands list function start here.
// **************************************
export const restoreBrand = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = { deleted_at: null };
    const result = await updateBrandById(id as string, data);
    if (!result) {
        throw new BadRequestError("Something issue in restore brand. Please try again ...", "restoreBrand() method error :")
    };

    res.status(StatusCodes.OK).json({
        message: "Brand restore successfully",
        data: result
    })
});


// **************************************
// ~ this get all deleted brand api is only use admin panel.
// * get all deleted brands list function start here.
// **************************************
export const getDeletedBrand = AsyncHandler(async (req: Request, res: Response) => {
    const query = req.query;
    const page = parseInt(query?.page as string) || 1;
    const limit = parseInt(query?.limit as string) || 10;
    const filter = req.body?.filter || {};
    const skip = (page - 1) * limit;
    const result = await getdeletdBrand(limit, skip, filter);
    res.status(StatusCodes.OK).json(result);
});


// **************************************
// ~ this update brands brand api is only use admin panel.
// * update brands list function start here.
// **************************************
export const updateBrand = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    const findBrand = await getBrandById(id as string);
    if (!findBrand) {
        throw new BadRequestError("Brand not exist please try again later", "updateBrand() method error")
    };

    //  ------------------ here i publish certificate ---------------------
    if (data?.certificate && isBase64Image(data?.certificate)) {
        const certificate_public_id = findBrand?.certificate_public_id || uuid();
        const certificateResponse = await uploadImage(data?.certificate, certificate_public_id, true, true);
        data.certificate_public_id = certificate_public_id;
        data.certificate = certificateResponse?.secure_url;
    };

    //  ------------------ here i publish logo ----------------
    if (data?.brand_logo && isBase64Image(data?.brand_logo)) {
        const brand_logo_public_id = findBrand.brand_logo_public_id || uuid();
        const brandLogoResponse = await uploadImage(data?.brand_logo, brand_logo_public_id, true, true);
        data.brand_logo_public_id = brand_logo_public_id;
        data.brand_logo = brandLogoResponse?.secure_url;
    };

    const result = await updateBrandById(id as string, data);

    res.status(StatusCodes.OK).json({
        message: "Brand updated successfully",
        data: result
    });

});


// **************************************
// ~ this get all active brand api is only use website.
// * get all active brand function start here
// **************************************
export const getAllActiveBrand = AsyncHandler(async (_req: Request, res: Response) => {
    const data = await getActiveBrand();
    res.status(StatusCodes.OK).json(data)
});