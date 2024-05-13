import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReviewCtrl } from "../controllers/reviewsCtrl.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:productID", isLoggedIn, createReviewCtrl);

export default reviewsRouter;
