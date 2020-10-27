// import { sql } from "../sql/petpals_queries";

const queries = require("../sql/petpals_queries").sql.query;
// Postgre SQL Connection
const { Pool } = require('pg');

// Change Database Settings Here BEFORE DEPLOYMENT
const pool = new Pool({
	user: 'me',
    host: 'localhost',
    database: 'petpals',
    password: 'my_password',
    port: 5432
});

module.exports.initRouter = function initRouter(app) {
    // Basic entry point test.
    app.get('/', (request, response) => {
        response.json({ info: 'Pet Pals backend started.' })
    });

    // POST Methods
    app.post('/register', register_user);
    app.post('/login', login);

    // GET Methods

    // UPDATE Methods

    // DELETE Methods

}

function query(req, fld) {
	return req.query[fld] ? req.query[fld] : '';
}

function register_user(req, res, next) {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const full_name = req.body.full_name;
    const location = req.body.location;
    const cardNumber = req.body.card;
    const type = req.body.type;

    pool
        .query(queries.add_user, [username, password, full_name, location, cardNumber])
        .then(result => res.status(200).json({ message: "User added successfully." }))
        .catch(err => { 
            res.status(400).send(err);
            console.log("error encountered");
        });
}

function login(req, res, next) {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    pool
        .query(queries.check_login_details, [username, password])
        .then(result => {
            if(!result.rows || result.rowCount==0) {
                res.status(404).json({ message: "Failed to login user: incorrect credentials" });
                console.log("Log in failed!");
            } else {
                res.status(200).json({ message: "Successfully logged in!" });
                console.log(result);
                console.log("Logged in!");
            }
        })
        .catch(error => { 
            res.status(404).send(error);
            console.log("Error encountered");
        });
}



