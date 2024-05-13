import dotenv from "dotenv";
import cors from "cors";
import Stripe from "stripe";
dotenv.config();
import express from "express";
import path from "path";

import dbConnect from "../config/dbConnect.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import brandsRouter from "../routes/brandsRouter.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import colorsRouter from "../routes/colorsRouter.js";
import ordersRouter from "../routes/ordersRouter.js";
import productsRouter from "../routes/productsRouter.js";
import reviewsRouter from "../routes/reviewsRouter.js";
import usersRoutes from "../routes/usersRouter.js";
import couponsRouter from "../routes/couponsRouter.js";
import Order from "../model/Order.js";

// db connect
dbConnect();
const app = express();

// cors
app.use(cors());

// stripe webhook
// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_96cd7f273071eb0ffb7fd0451cc4a0df6213ae68ddfbea3f2e6800714699d4c4";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event");
    } catch (err) {
      console.log("err", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case "checkout.session.completed":
        // update the order
        const session = event.data.object;
        const { orderId } = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total;
        const currency = session.currency;

        // find the order
        const order = await Order.findByIdAndUpdate(
          JSON.parse(orderId),
          {
            paymentStatus,
            paymentMethod,
            totalPrice: totalAmount / 100,
            currency,
          },
          {
            new: true,
          },
        );
        console.log(order);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // // Handle the event
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     const paymentIntentSucceeded = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  },
);

// pass incoming data
app.use(express.json());

// url encoded
app.use(express.urlencoded({ extended: true }));

// server static files
app.use(express.static("public"));

// routes
// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join("public", "index.html"));
});

app.use("/api/v1/users/", usersRoutes);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/colors/", colorsRouter);
app.use("/api/v1/reviews/", reviewsRouter);
app.use("/api/v1/orders/", ordersRouter);
app.use("/api/v1/coupons/", couponsRouter);

//err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
