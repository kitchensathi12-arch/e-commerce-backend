import { IBrandDocument } from "@kitchensathi12-arch/ecommerce-types";
import { Schema, model } from "mongoose";

const brandSchema = new Schema<IBrandDocument>(
  {
    brand_name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      maxlength: 150,
    },

    brand_logo: {
      type: String,
      required: true,
    },
    brand_logo_public_id: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      maxlength: 1000,
    },

    authorized: {
      type: Boolean,
      default: true,
      required: true,
    },

    valid: {
      type: Date,
    },

    certificate: {
      type: String,
      required: true,
    },
    certificate_public_id: {
      type: String,
      required: true,
    },

    metaTitle: {
      type: String,
      maxlength: 60,
    },

    metaDescription: {
      type: String,
      maxlength: 160,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const BrandModel = model<IBrandDocument>("Brand", brandSchema);