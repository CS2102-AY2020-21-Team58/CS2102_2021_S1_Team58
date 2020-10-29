// import { sql } from "../sql/petpals_queries";

const queries = require("../sql/petpals_queries").sql.query;
// Postgre SQL Connection
const { Pool } = require('pg');

// Change Database Settings Here BEFORE DEPLOYMENT
const pool = new Pool({
	user: 'me',
    password: 'my_password',
    host: 'localhost',
    database: 'petpals',
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
    app.get('/route/:id/:name', function_name); // This is an example.
    app.get('/get_available_caretakers', get_available_caretakers);  // Not sure of name, might be under bookings??

    // UPDATE Methods
    app.put('/route', function_name); // This is an example.

    // DELETE Methods
    app.delete('/route/:id/:name', function_name); // This is an example.

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
    let secondaryQuery;

    if(type=="Administrator") {
        secondaryQuery = queries.add_admin;
    } else if (type=="Full_Timer") {    
        secondaryQuery = queries.add_full_timer;
    } else if (type=="Part_Timer") {
        secondaryQuery = queries.add_part_timer;
    } else if (type=="Owner") {
        secondaryQuery = queries.add_pet_owner;
    } else {
        res.status(400).send("Incorrect user type");
        return;
    }

    pool.query(queries.add_user, [username, password, full_name, location, cardNumber])
        .then(result => res.status(200).json({ message: "User added successfully." }))
        .catch(err => { 
            res.status(400).send(err);
            console.log("error encountered");
        })
        .then(pool.query(querries.add_care_taker, [username]));
}

function login(req, res, next) {
    console.log(req);
    const username = req.body.username;
    const password = req.body.password;

    pool.query(queries.check_login_details, [username, password])
        .then(result => {
            if(!result.rows || result.rowCount==0) {
                res.status(404).json({ message: "Failed to login user: incorrect credentials" });
                console.log("Log in failed!");
            } else {
                res.status(200).json({ message: "Successfully logged in!" });
                console.log("Logged in!");
            }
        })
        .catch(error => { 
            res.status(404).json({ message: "Encountered problem while authenticating." }).send(error);
            console.log(error);
        });
}

/**
 *
 * Provide the following:
 * start_period: String, Format: YYYY-MM-DD or DD/MM/YYYY
 * end_period: String, Format: YYYY-MM-DD or DD/MM/YYYY
 * owner: String (owner username from pets table)
 * pet_name: String
 *
 */
function get_available_caretakers(req, res, next) {
    console.log(req);
    const start_period = req.body.start_period;
    const end_period = req.body.end_period;
    const owner = req.body.owner;
    const pet_name = req.body.pet_name;

    pool.query(queries.search_caretaker, [start_period, end_period, owner, pet_name])
        .then(result => {
            res.status(200).json({ results: result.rows });
            console.log("Successfully fetched available caretakers!");
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem finding available caretakers.", error: err});
            console.log(err);
        });
}
