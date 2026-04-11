import { BrandModel } from "@/models/brand.model"
import { IBrandDocument, IBrandPayload } from "@kitchensathi12-arch/ecommerce-types";
import { IBrandUpdatePayload } from "@kitchensathi12-arch/ecommerce-types/src/interface/brand.interface";


export const createBrandService = async (data: IBrandPayload): Promise<IBrandDocument> => {
    const result = await BrandModel.create(data);
    return result;
};

export const paginateWithFilterBrand = async (limit: number, skip: number, filter: any): Promise<{ data: IBrandDocument[] | [], totalData: number, totalPage: number }> => {
    console.log(filter)
    const result = await BrandModel.aggregate([
        {
            $match: { ...filter, deleted_at: null },
        },
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: limit }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        }
    ])
    return { data: result[0].data, totalData: result[0].totalCount[0]?.count || 0, totalPage: Math.ceil((result[0].totalCount[0]?.count || 0) / limit) }

};

export const findBrandByNameOrSlug = async (brandName: string, brandSlug: string): Promise<IBrandDocument | null | undefined> => {
    const result = await BrandModel.findOne({ $or: [{ brand_name: brandName }, { slug: brandSlug }] }).exec();
    return result;
};

export const getActiveBrand = async (): Promise<IBrandDocument[]> => {
    const result = await BrandModel.find({ deleted_at: null, isActive: true }).select("brand_name brand_logo slug certificate valid createdAt").exec();
    return result;
}


export const deleteBrandById = async (id: string): Promise<IBrandDocument | null | undefined> => {
    const result = await BrandModel.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true });
    return result
};

export const updateBrandById = async (id: string, data: IBrandUpdatePayload): Promise<IBrandDocument | null | undefined> => {
    const result = await BrandModel.findByIdAndUpdate(id, data, { new: true });
    return result;
};

export const getdeletdBrand = async (limit: number, skip: number, filter: any): Promise<{data:IBrandDocument[],totelBrand:number,totalPage:number}> => {
    const result = await BrandModel.aggregate([
        {
            $match: { ...filter, deleted_at: { $ne: null } }
        },
        {
            $project:{
                brand_name:1,
                brand_logo:1,
                slug:1,
                certificate:1,
                deleted_at:1,
                createdAt:1
            }
        },
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: limit },
                ],
                totalBrands: [
                    { $count: "count" }
                ]
            }
        }
    ]);
    return {data:result[0].data,totelBrand:result[0]?.totalBrands[0]?.count,totalPage:Math.ceil(result[0]?.totalBrands[0]?.count / limit)}
};

export const getBrandById = async (id:string) => {
    const result = await BrandModel.findById(id);
    return result;
}




