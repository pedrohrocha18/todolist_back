import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/index.js";

const app = express();

dotenv.config();

const corsOptions = {
  origin: "https://todolist-interface.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const PORT = process.env.SERVER_PORT || 3001;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routes);

// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });

export default app;
