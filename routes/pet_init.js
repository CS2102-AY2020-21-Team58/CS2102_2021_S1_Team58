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
    app.post('/createbid', create_bid);

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
    let secondaryQuery;

    if(type=="Administrator") {
        secondaryQuery = queries.add_admin;
    } else if (type=="Full_Timer") {    
        secondaryQuery = queries.add_care_taker;
    } else if (type=="Part_Timer") {
        secondaryQuery = queries.add_care_taker;
    } else if (type=="Owner") {
        secondaryQuery = queries.add_pet_owner;
    } else {
        return;
    }

    pool.query(queries.add_user, [username, password, full_name, location, cardNumber])
        .catch(err => { 
            return Promise.reject("Error: User with username already exists!");
        })
        .then(() => pool.query(secondaryQuery, [username]))
        .then(() => {
            if (type == "Part_Timer") {
                pool.query(queries.add_part_timer, [username])
                    .catch(() => Promise.reject("Error: Problem adding caretaker."));
            } else if (type == "Full_Timer") {
                pool.query(queries.add_full_timer, [username])
                    .catch(() => Promise.reject("Error: Problem adding caretaker."));
            } else {
                // Do nothing
            }
        })
        .then(() => res.status(200).json({ message: "User added successfully." }))
        .catch(error => {
            console.log(error);
            res.status(400).json({ message: error });
        });
}

function login(req, res, next) {
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
            res.status(404).json({ message: "Encountered problem while authenticating.", error: error });
            console.log(error);
        });
}

function create_bid(req, res, next) {
    const owner = req.body.owner;
    const pet_name = req.body.pet_name;
    const caretaker = req.body.caretaker;
    const start_period = req.body.start_period;
    const end_period = req.body.end_period;
    const payment_method = req.body.payment_method;
    const delivery_method = req.body.delivery_method;
    const status = "PENDING";
    const bid_rate = req.body.bid_rate;

    pool.query(queries.add_initial_booking, [owner, pet_name, caretaker, start_period, end_period, payment_method, delivery_method, status, bid_rate])
        .then(() => {
            res.status(200).json({ message: "Booking created!" });
            console.log("Successfully added booking!");
        })
        .catch(err => {
            res.status(404).json({ message: "Encountered problem while creating bid.", error: err });
            console.log(err);
    });
}

function get_jobs(req, res, next) {
    const results = [];
}