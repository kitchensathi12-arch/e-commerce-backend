import { CategoryModel } from "@/models/category.model";
import { ICategoryDocument } from "@kitchensathi12-arch/ecommerce-types";
import { ICategoryPayload } from "@kitchensathi12-arch/ecommerce-types/src/interface/category.interface";


export const createCategoryService = async (data: ICategoryPayload): Promise<ICategoryDocument> => {
    const result = await CategoryModel.create(data);
    return result;
};

export const getCategoryServerService = async (limit: number, skip: number): Promise<{ data: ICategoryDocument[], totalData: number, totalPage: number }> => {
    const result = await CategoryModel.aggregate([
        {
            $match: { $or:[{deleted_at: { $exists: false }},{deleted_at:null}]}
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
    ]);
    return { data: result[0].data, totalData: result[0].totalCount[0]?.count || 0, totalPage: Math.ceil((result[0].totalCount[0]?.count  || 0)/ limit) }
};

export const getActiveCategoryService = async (): Promise<ICategoryDocument[]> => {
    const result = await CategoryModel.find({ $or:[{deleted_at: { $exists: false }},{deleted_at:null}], isActive: true });
    return result;
};

export const updateCategoryService = async (id: string, data: ICategoryDocument): Promise<ICategoryDocument> => {
    const result = await CategoryModel.findByIdAndUpdate(id, data, { new: true }) as ICategoryDocument;
    return result;
};

export const deleteCategoryService = async (id: string,val:number | string): Promise<ICategoryDocument> => {
    const result = await CategoryModel.findByIdAndUpdate(id,{deleted_at:val}) as ICategoryDocument;
    return result
};

export const findCategoryBySlug = async (slug: string): Promise<ICategoryDocument> => {
    const result = await CategoryModel.findOne({ slug }).exec() as ICategoryDocument;
    return result
};

export const getAlldeletedCategoriesService = async (limit: number, skip: number): Promise<{ data: ICategoryDocument[], totelData: number, totelPage: number }> => {
    const result = await CategoryModel.aggregate([
        {
            $match: { $and:[{deleted_at: { $exists: true }},{deleted_at:{ $ne: null }}]}
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
    ]);

    return {data:result[0].data,totelData:result[0]?.totalCount[0]?.count || 0,totelPage:Math.ceil((result[0].totalCount[0]?.count || 0)/limit)}
};

export const findCategoryById = async(id:string):Promise<ICategoryDocument> => {
    const result = await CategoryModel.findById(id) as ICategoryDocument;
    return result;
};