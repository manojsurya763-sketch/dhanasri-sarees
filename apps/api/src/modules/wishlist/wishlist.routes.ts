import { Router } from "express";
import { addWishlistItem, listWishlist, removeWishlistItem } from "@/modules/wishlist/wishlist.controller";

export const wishlistRouter = Router();

wishlistRouter.get("/", listWishlist);
wishlistRouter.post("/", addWishlistItem);
wishlistRouter.delete("/:id", removeWishlistItem);
