require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const rota = require("./routes");

app.use(cors());

app.use(express.json());

app.use(rota);

app.listen(process.env.DB_PORT, () =>
  console.log(`Ouvindo a porta ${process.env.DB_PORT}`)
);
