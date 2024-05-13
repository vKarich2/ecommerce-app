import express from "express";
import {
  createProductCtrl,
  getProductsCtrl,
  getProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
} from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import upload from "../config/fileUpload.js";

const productsRouter = express.Router();

productsRouter.post("/", isLoggedIn, isAdmin, upload.array("files"), createProductCtrl);
productsRouter.get("/", getProductsCtrl);
productsRouter.get("/:id", getProductCtrl);
productsRouter.put("/update/:id", isLoggedIn, isAdmin, updateProductCtrl);
productsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteProductCtrl);

export default productsRouter;
