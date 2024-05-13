import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createColorCtrl,
  deleteColorCtrl,
  getColorCtrl,
  getColorsCtrl,
  updateColorCtrl,
} from "../controllers/colorsCtrl.js";


const colorsRouter = express.Router();

colorsRouter.post("/", isLoggedIn, isAdmin, createColorCtrl);
colorsRouter.get("/", getColorsCtrl);
colorsRouter.get("/:id", getColorCtrl);
colorsRouter.put("/update/:id", isLoggedIn, isAdmin, updateColorCtrl);
colorsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteColorCtrl);

export default colorsRouter;
