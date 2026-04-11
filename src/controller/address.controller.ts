import {
  createAddressService,
  deleteAddressService,
  getAddressesByUserIdService,
  getAddressesByUserIdWithPaginationService,
  updateAddressService
} from '@/services/address.service';
import { AsyncHandler } from '@/utils/AsyncHandler';
import { BadRequestError, NotFoundError } from '@kitchensathi12-arch/ecommerce-types';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

const MAX_ADDRESSES = 10;

export const createAddress = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const  userId = req.currentUser!.id;
  const count = await getAddressesByUserIdService(userId);
  if (count.length >= MAX_ADDRESSES) {
    throw new BadRequestError('Maximum address limit reached. Please delete an address first.', 'createAddress() method error');
  }
  const address = await createAddressService({
    ...req.body,
    user_id: userId
  });
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Address added successfully',
    data: address
  });
});

export const getAllAddresses = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.currentUser!.id as unknown as Types.ObjectId;

  const page: number = parseInt(req.query.page as string, 10) || 1;
  const limit: number = parseInt(req.query.limit as string, 10) || 10;
  const skip: number = (page - 1) * limit;

  const data = await getAddressesByUserIdWithPaginationService(userId, skip, limit);
  res.status(StatusCodes.OK).json(data);
});

export const updateAddress = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.currentUser!.id as unknown as Types.ObjectId;

  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
  const address = await updateAddressService(id, userId, req.body);
  if (!address) {
    throw new NotFoundError('Address not found', 'updateAddress() method error');
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Address updated successfully',
    data: address
  });
});

export const deleteAddress = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.currentUser!.id as unknown as Types.ObjectId;
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
  const address = await deleteAddressService(id, userId);
  if (!address) {
    throw new NotFoundError('Address not found or already deleted', 'deleteAddress() method error');
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Address deleted successfully',
    data: address
  });
});
