require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pet_router = require("./routes/pet_init");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

pet_router.initRouter(app);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
