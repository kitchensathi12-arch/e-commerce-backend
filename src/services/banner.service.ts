import { BannerModel } from "@/models/banner.model";
import { IBannerDocument} from "@kitchensathi12-arch/ecommerce-types";

/*
start *************************************
* here is the service of create banners.
*/
export const createBannerService = async (data:IBannerDocument):Promise<IBannerDocument>  => {
    const result:IBannerDocument = await BannerModel.create(data);
    return result;
};

/*
start *************************************
* here is the service of update banners.
*/
export const updateBannerService = async (id:string,data:IBannerDocument):Promise<IBannerDocument> => {
    const result:IBannerDocument = await BannerModel.findByIdAndUpdate(id,data,{new:true}) as IBannerDocument;
    return result;
};

/*
start *************************************
* here is the service of delete banners.
*/
export const deleteBannerService = async (id:string):Promise<IBannerDocument> => {
    const result: IBannerDocument = await BannerModel.findByIdAndDelete(id) as IBannerDocument;
    return result;
};

/*
start *************************************
* here is the service of get only active banners.
*/
export const getActiveBannersService = async ():Promise<IBannerDocument[]> => {
    const result:IBannerDocument[] = await BannerModel.find({isActive:true});
    return result;
};

/*
start *************************************
* here is the service of get all banners with pagination banners.
*/
export const  getAllBannersWithPagination = async (skip:number,limit:number):Promise<{result:IBannerDocument[],totalData:number,totalPages:number}> => {
    const totalDocument:number = await BannerModel.find().countDocuments();
    const result: IBannerDocument[] = await BannerModel.find().skip(skip).limit(limit).sort({_id:-1});
    return{result,totalData:totalDocument,totalPages:Math.ceil(totalDocument/limit)}
};

/*
start *************************************
* here is the service of find one banner they title will matched.
*/
export const findBannerByTitle = async (title:string):Promise<IBannerDocument | null> => {
    const result = await BannerModel.findOne({title});
    return result;
};


/*
start *************************************
* here is the service of find one banner they id will matched.
*/
export const findBannerById = async (id:string):Promise<IBannerDocument | null> => {
    const result = await BannerModel.findById(id);
    return result;
}