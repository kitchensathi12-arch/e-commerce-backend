import { UserModel } from "@/models/user.modal";
import { IAuthDocument } from "@kitchensathi12-arch/ecommerce-types";
import { Types } from "mongoose";


export const createUser = async (data:IAuthDocument):Promise<IAuthDocument> => {
    let result = await UserModel.create(data);
    result.password = undefined;
    return result;
};

export const findUserByEmail = async (email:Object ): Promise<IAuthDocument | null> => {
    const result:IAuthDocument | null = await UserModel.findOne({email});
    return result;
};

export const findUserById = async (id:Types.ObjectId): Promise<IAuthDocument | null> => {
    const result:IAuthDocument | null = await UserModel.findById(id).select("full_name email phone username role profile_picture profile_public_id ");
    return result;
};

export const findUserByIdWithPassword = async (id:Types.ObjectId): Promise<IAuthDocument | null> => {
    const result:IAuthDocument | null = await UserModel.findById(id);
    return result;
}

export const findUserByEmailOrUsername = async (email:string, username:string): Promise<IAuthDocument | null> => {
    const result:IAuthDocument | null = await UserModel.findOne({$or: [{email}, {username}]});
    return result;
};

export const findUserByUsername = async (username:string): Promise<IAuthDocument | null> => {
    const result:IAuthDocument | null = await UserModel.findOne({username});
    return result;
};

export const findUserByEmailVerificationToken = async (token:string):Promise<IAuthDocument | null> => {
    const result: IAuthDocument | null = await UserModel.findOne({email_verification_token:token});
    return result;
 }

 export const findUserByPasswordToken = async (token:string):Promise<IAuthDocument | null> => {
    const result: IAuthDocument | null = await UserModel.findOne({password_reset_token:token});
    return result;
 }


export const updateUserById = async (id:Types.ObjectId,data:IAuthDocument):Promise<IAuthDocument | null> => {
    const result:IAuthDocument | null = await UserModel.findByIdAndUpdate(id,data,{new:true});
    return result;
};

// export const 