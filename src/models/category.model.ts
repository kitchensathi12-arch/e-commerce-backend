import { ICategoryDocument } from "@kitchensathi12-arch/ecommerce-types";
import  { Schema, Model, model } from "mongoose";


const categorySchema: Schema<ICategoryDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
    },

    image_public_id: {
      type: String,
    },

    metaTitle: {
      type: String,
    },

    metaDescription: {
      type: String,
    },

    metaKeywords: {
      type: [String],
      default: [],
    },

    deleted_at:{
      type:Date,
      default:null
    },

    isActive: {
      type: Boolean,
      required:false,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ isActive: 1 });


export const CategoryModel: Model<ICategoryDocument> =model<ICategoryDocument>("Category", categorySchema);