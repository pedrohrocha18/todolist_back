import { Router } from "express";
import userRoutes from "./userRoutes.js";

const routes = Router();

routes.use("/user", userRoutes);

routes.get("/", (req, res) => {
  res.send("Welcome!");
});

export default routes;
