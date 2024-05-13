import express from "express";
import { createCoupon, getCoupons, getCoupon, updateCoupon, deleteCoupon } from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedIn, isAdmin, createCoupon);
couponsRouter.get("/", isLoggedIn, isAdmin, getCoupons);
couponsRouter.get("/:id", isLoggedIn, getCoupon);
couponsRouter.put("/update/:id", isLoggedIn, isAdmin, updateCoupon);
couponsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCoupon);

export default couponsRouter;

