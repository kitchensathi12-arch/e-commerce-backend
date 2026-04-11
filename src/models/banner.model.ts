import { IBannerDocument } from "@kitchensathi12-arch/ecommerce-types";
import { Model, model, Schema } from "mongoose";


const bannerSchema = new Schema<IBannerDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      required: true, // Cloudinary/S3 URL
    },

    image_public_id:{
      type:String,
      required:true
    },

    buttonText: {
      type: String,
    },

    redirectUrl: {
      type: String,
    },

    type: {
      type: String,
      enum: ["hero", "category", "offer", "popup"],
      default: "hero",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    priority: {
      type: Number,
      default: 0, // Higher number = higher display priority
    },
  },
  { timestamps: true }
);

export const BannerModel:Model<IBannerDocument> = model<IBannerDocument>("Banner", bannerSchema);