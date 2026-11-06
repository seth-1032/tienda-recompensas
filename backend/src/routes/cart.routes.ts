
import { Router } from "express";
import { addToCartController, getCartController, updateCartItemController, removeCartItemController } from "../controllers/cart.controller.js";

const router = Router();

router.post("/", addToCartController);
router.get("/", getCartController);
router.put("/:productId", updateCartItemController);
router.delete("/:productId", removeCartItemController);

export default router;
