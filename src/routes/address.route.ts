import { createAddress, deleteAddress, getAllAddresses, updateAddress } from '@/controller/address.controller';
import { Validator } from '@/utils/validator';
import { createAddressValidationSchema, updateAddressValidationSchema } from '@kitchensathi12-arch/ecommerce-types';
import express, { Router } from 'express';


export const addressRoutes = (): Router => {
  const routes: Router = express.Router();
  routes.post('/create', Validator(createAddressValidationSchema), createAddress);
  routes.get('/get-all-address', getAllAddresses);
  routes.put('/update/:id', Validator(updateAddressValidationSchema), updateAddress);
  routes.delete('/delete/:id', deleteAddress);

  return routes;
};
