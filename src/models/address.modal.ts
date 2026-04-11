import { IAddressDocument } from '@kitchensathi12-arch/ecommerce-types';
import { model, Model, Schema } from 'mongoose';



const addressSchema: Schema = new Schema<IAddressDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    alternate_phone: {
      type: String,
      trim: true
    },
    address_line_1: {
      type: String,
      required: true
    },
    address_line_2: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    landmark: {
      type: String,
      trim: true
    },
    pin_code: {
      type: String,
      required: true,
      trim: true,
    },

    address_type: {
      type: String,
      enum: ['home', 'work'],
      default: 'home',
      required: true
    },

    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index:true
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);


export const AddressModel: Model<IAddressDocument> = model<IAddressDocument>('Address', addressSchema);
