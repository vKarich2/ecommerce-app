import express from "express";
import { registerUserCtrl, loginUserCtrl, getUserProfileCtrl, updateShippingAddressCtrl, deleteUserCtrl } from "../controllers/usersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";


const usersRouter = express.Router();

usersRouter.post("/register", registerUserCtrl);
usersRouter.post("/login", loginUserCtrl);
usersRouter.get("/profile", isLoggedIn, getUserProfileCtrl);
usersRouter.put("/update/shipping", isLoggedIn, updateShippingAddressCtrl);
usersRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteUserCtrl);

export default usersRouter;

