require("dotenv").config();
const express = require("express");
const cors = require("cors");
const peopleRoutes = require("./routes/people");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/people", peopleRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});
