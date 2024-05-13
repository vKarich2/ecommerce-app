import http from "http";
import app from "./app/app.js";
dotenv.config();
import dotenv from "dotenv";

// create the server
const server = http.createServer(app);
server.listen(
  process.env.PORT,
  console.log(`Server is up and running on port ${process.env.PORT}`),
);
