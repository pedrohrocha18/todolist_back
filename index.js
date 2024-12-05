import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes/index.js";

const app = express();

dotenv.config();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
