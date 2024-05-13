import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createOrderCtrl,
  getOrdersCtrl,
  getOrderCtrl,
  updateOrderCtrl,
  deleteOrderCtrl,
  getOrderStatsCtrl,
} from "../controllers/ordersCtrl.js";

const ordersRouter = express.Router();

ordersRouter.post("/", isLoggedIn, isAdmin, createOrderCtrl);
ordersRouter.get("/", isLoggedIn, isAdmin, getOrdersCtrl);
ordersRouter.get("/:id", isLoggedIn, isAdmin, getOrderCtrl);
ordersRouter.put("/update/:id", isLoggedIn, isAdmin, updateOrderCtrl);
ordersRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteOrderCtrl);
ordersRouter.get("/sales/stats", isLoggedIn, isAdmin, getOrderStatsCtrl);

export default ordersRouter;
