import { Router } from "express";
import userRoutes from "./routes/userRoutes";

const routes = Router();

routes.use("/user", userRoutes);

routes.get("/", (req, res) => {
  res.send("opa");
});

export default routes;
