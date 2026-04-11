import { IProductDocument } from "@kitchensathi12-arch/ecommerce-types";
import { model, Schema } from "mongoose";

// ─── Sub Schemas ───────────────────────────────────────────────

const imageSchema = new Schema({
    image_url: { type: String, required: true },
    image_public_id: { type: String, required: true }
});

const productDetailsSchema = new Schema({
    key: { type: String, required: true },
    value: { type: String, required: true }
})


// ─── Main Product Schema ────────────────────────────────────~

export const productSchema = new Schema<IProductDocument>({
    product_name: {
        type: String,
        required: true,
    },
    product_title: {
        type: String,
        required: true,
    },
    product_slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    product_description: {
        type: String
    },
    product_images: {
        type: [imageSchema],
        required: true
    },
    product_selling_price: {
        type: Number,
        required: true,
    },
    product_mrp_price: {
        type: Number,
        required: true,
    },
    product_discount: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },

    // ─── Inventory & Stock ─────────────────────────────────────
    product_sku: {
        type: String,
        unique: true,
        index: true
    },
    product_stock: {
        type: Number,
        required: true,
        default: 0
    },
    low_stock_threshold: {
        type: Number,
        default: 5               // alert when stock falls below this
    },
    in_stock: {
        type: Boolean,
        required: true,
        default: true
    },

    // ─── SEO & Marketing ───────────────────────────────────────
    meta_title: { type: String },
    meta_description: { type: String },
    meta_keywords: { type: [String], default: [] },
    product_tags: {
        type: [String],
        default: []
    },
    is_featured: {
        type: Boolean,
        default: false
    },
    is_new_arrival: {
        type: Boolean,
        default: false
    },
    deleted_at:{
        type:Date,
        default:null
    },
    product_details: {
    type: [productDetailsSchema],
    default:[]
}

}, {
    timestamps: true
});

export const ProductModel = model("Product",productSchema)

