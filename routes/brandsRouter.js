import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createBrandCtrl,
  deleteBrandCtrl,
  getBrandCtrl,
  getBrandsCtrl,
  updateBrandCtrl,
} from "../controllers/brandsCtrl.js";


const brandsRouter = express.Router();

brandsRouter.post("/", isLoggedIn, isAdmin, createBrandCtrl);
brandsRouter.get("/", getBrandsCtrl);
brandsRouter.get("/:id", getBrandCtrl);
brandsRouter.put("/update/:id", isLoggedIn, isAdmin, updateBrandCtrl);
brandsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteBrandCtrl);

export default brandsRouter;
