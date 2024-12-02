import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes/index.js";

const app = express();

dotenv.config();

app.use(cors());

const PORT = process.env.SERVER_PORT || 3001;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
