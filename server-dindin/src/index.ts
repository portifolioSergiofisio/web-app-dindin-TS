require("dotenv").config();
import cors from "cors";
import express from "express";
import rota from "./routes";
const app = express();

app.use(cors());

app.use(express.json());

app.use(rota);

app.listen(process.env.PORT, () =>
  console.log(`Ouvindo a porta ${process.env.PORT}`)
);
