// import { sql } from "../sql/petpals_queries";

const queries = require("../sql/petpals_queries").sql.query;
// Postgre SQL Connection
const { Pool } = require('pg');

// Change Database Settings Here BEFORE DEPLOYMENT
const pool = new Pool({
	user: 'postgres',
    password: 'mustafa786',
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

    // // GET Methods
    app.get('/getpetsofowner/:username', get_pets_of_owner);
    app.get('/getallservices/', get_all_services);
    app.get('/getallservices/', get_pending_bids);
    app.get('/getallservices/', get_pending_bids);
    app.get('/getmonthmaxjobs/', get_month_of_max_jobs);
    app.get('/getjobsinmaxjobsmonth/', get_jobs_max_job_month);

    // // UPDATE Methods
    // app.put('/route', function_name); // This is an example.

    // // DELETE Methods
    // app.delete('/route/:id/:name', function_name); // This is an example.

}

function query(req, fld) {
	return req.query[fld] ? req.query[fld] : '';
}

/**
 * 
 * Provide following in path:
 * owner_name: String --> Has to be an owner
 * 
 */
function get_pets_of_owner(req, res, next) {
    console.log(req.params);
    const owner_name = req.params.username;
    pool.query(queries.get_pet_owners_pets, [owner_name])
    .then(result => {
        console.log(result);
        res.status(200).json({ results: result.rows });
        console.log("Successfully fetched pets with their services!");
    })
    .catch(err => {
        res.status(404).json({ message: "Encountered problems fetching pets of owners", error: err }).send(error);
        console.log(err);
    });
}

/**
 * 
 * Provide nothing;
 * 
 */
function get_all_services(req, res, next) {
    console.log(req.params);
    pool.query(queries.get_all_services)
    .then(result => {
        console.log(result);
        res.status(200).json({ results: result.rows });
        console.log("Successfully fetched services PetPals can provide");
    })
    .catch(err => {
        res.status(404).json({ message: "Encountered problems fetching services PetPals can provide", error: err }).send(error);
        console.log(err);
    });
}

/**
 * 
 * Provide following in path:
 * owner_name: String --> Has to be an owner
 * 
 */
function get_pending_bids(req, res, next) {
    console.log(req.params);
    const owner_name = req.params.username;
    pool.query(queries.get_all_pending_pet_owners_bookings, [owner_name])
    .then(result => {
        console.log(result);
        res.status(200).json({ results: result.rows });
        console.log("Successfully got bids of an Owner");
    })
    .catch(err => {
        res.status(404).json({ message: "Encountered problems getting bids of an owner", error: err }).send(error);
        console.log(err);
    });
}

/**
 * 
 * Provide nothing;
 * 
 */
function get_month_of_max_jobs(req, res, next) {
    console.log(req.params);
    pool.query(queries.get_month_where_max_pets_taken_care)
    .then(result => {
        console.log(result);
        res.status(200).json({ results: result.rows });
        console.log("Successfully got month with max jobs");
    })
    .catch(err => {
        res.status(404).json({ message: "Encountered problems getting month with max jobs", error: err }).send(error);
        console.log(err);
    });
}

/**
 * 
 * Provide nothing;
 * 
 */
function get_month_of_max_jobs(req, res, next) {
    console.log(req.params);
    pool.query(queries.get_month_where_max_pets_taken_care)
    .then(result => {
        console.log(result);
        res.status(200).json({ results: result.rows });
        console.log("Successfully got month with max jobs");
    })
    .catch(err => {
        res.status(404).json({ message: "Encountered problems getting month with max jobs", error: err }).send(error);
        console.log(err);
    });
}

/**
 * 
 * Provide nothing;
 * 
 */
function get_jobs_max_job_month(req, res, next) {
    console.log(req.params);
    pool.query(queries.get_jobs_number_during_month_with_max_jobs)
    .then(result => {
        console.log(result);
        res.status(200).json({ results: result.rows });
        console.log("Successfully got jobs in month with max jobs");
    })
    .catch(err => {
        res.status(404).json({ message: "Encountered problems getting jobs in month with max jobs", error: err }).send(error);
        console.log(err);
    });
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



