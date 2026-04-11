import { AddressModel } from '@/models/address.modal';
import { IAddressDocument } from '@kitchensathi12-arch/ecommerce-types';
import { Types } from 'mongoose';

export const createAddressService = async (data: Omit<IAddressDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<IAddressDocument> => {
  const result = await AddressModel.create(data);
  return result;
};

export const getAddressesByUserIdService = async (userId: string): Promise<IAddressDocument[]> => {
  const result = await AddressModel.find({
    user_id: userId,
    is_deleted: false
  }).sort({ createdAt: -1 });
  return result;
};

export const getAddressesByUserIdWithPaginationService = async (
  userId: Types.ObjectId,
  skip: number,
  limit: number
): Promise<{ result: IAddressDocument[]; totalData: number; totalPages: number }> => {
  const totalDocument: number = await AddressModel.find({
    user_id: userId,
    is_deleted: false
  }).countDocuments();

  const result: IAddressDocument[] = await AddressModel.find({
    user_id: userId,
    is_deleted: false
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return { result, totalData: totalDocument, totalPages: Math.ceil(totalDocument / limit) };
};

export const updateAddressService = async (
  addressId: string,
  userId: Types.ObjectId,
  data: Partial<Omit<IAddressDocument, '_id' | 'user_id' | 'createdAt' | 'updatedAt'>>
): Promise<IAddressDocument | null> => {
  const result = await AddressModel.findOneAndUpdate({ _id: addressId, user_id: userId, is_deleted: false }, { $set: data }, { new: true });
  return result;
};

export const deleteAddressService = async (addressId: string, userId: Types.ObjectId): Promise<IAddressDocument | null> => {
  const result = await AddressModel.findOneAndUpdate(
    { _id: addressId, user_id: userId, is_deleted: false },
    { $set: { is_deleted: true } },
    { new: true }
  );
  return result;
};
