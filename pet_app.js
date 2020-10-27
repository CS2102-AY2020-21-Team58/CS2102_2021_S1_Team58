const express = require('express');
const bodyParser = require('body-parser');
const pet_router = require('./routes/pet_init');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

pet_router.initRouter(app);

app.listen(port, () => {
    console.log(`App running on port ${PORT}.`)
});
