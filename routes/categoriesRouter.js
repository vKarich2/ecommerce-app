import express from "express";
import {
  createCategoryCtrl,
  deleteCategoryCtrl,
  getCategoriesCtrl,
  getCategoryCtrl,
  updateCategoryCtrl,
} from "../controllers/categoriesCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import categoryUpload from "../config/categoryUpload.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/", isLoggedIn, isAdmin, categoryUpload.single("file"), createCategoryCtrl);
categoriesRouter.get("/", getCategoriesCtrl);
categoriesRouter.get("/:id", getCategoryCtrl);
categoriesRouter.put("/update/:id", isLoggedIn, isAdmin, updateCategoryCtrl);
categoriesRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCategoryCtrl);

export default categoriesRouter;
