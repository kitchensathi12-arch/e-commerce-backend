import { IWishlistDocument } from "@kitchensathi12-arch/ecommerce-types";
import { model, Schema } from "mongoose";


const wishlistSchema = new Schema<IWishlistDocument>({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
}, { timestamps: true });

export const WishlistModel = model<IWishlistDocument>("Wishlist", wishlistSchema);

