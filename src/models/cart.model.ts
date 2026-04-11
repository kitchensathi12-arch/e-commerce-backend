import { ICartDocument } from "@kitchensathi12-arch/ecommerce-types";
import { model, Schema } from "mongoose";


const cartSchema = new Schema<ICartDocument>({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true },
    currency: { type: String, required: true, enum: ['INR', 'USD'] }
}, { timestamps: true });

export const CartModel = model<ICartDocument>("Cart", cartSchema);

