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
    app.post('/booking', create_bid);

    // GET Methods
    app.get('/booking', get_bookings);
    app.get('/booking/:user/:username', get_user_bookings);

    // UPDATE Methods
    app.put('/booking/:owner/:pet_name/:caretaker/:start_period/:end_period', handlebooking);

    // DELETE Methods

}

/**
 * 
 * Provide following:
 * username: String
 * passowrd: String
 * full_name: String
 * location: String
 * card: integer of 16 digits
 * type: Administrator OR Full_Timer OR Part_Timer OR Owner
 * 
 */
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
            res.status(400).json({ error });
        });
}

/**
 * 
 * Provide the following:
 * username: String
 * password: String
 * 
 */
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
            res.status(404).json({ message: "Encountered problem while authenticating.", error });
            console.log(error);
        });
}

/**
 * 
 * Provide the following:
 * owner: String
 * pet_name: String
 * caretkaer: String
 * start_period: String - Format: YYYY-MM-DD
 * end_period: String - Format: YYYY-MM-DD
 * payment_method: String
 * delivary_method: String
 * bid_rate: integer
 * 
 */
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
            res.status(404).json({ message: "Encountered problem while creating bid.", err });
            console.log(err);
    });
}

/**
 * 
 * Provide the following:
 * user: owner or caretaker
 * username: String
 * 
 */
function get_user_bookings(req, res, next) {
    console.log(req.params);

    const user_type = req.params.user;
    const username = req.params.username;
    let query = user_type == "owner" ? queries.get_all_pet_owners_bookings : user_type == "caretaker" ? queries.get_all_caretaker_bookings : null;

    pool.query(query, [username])
        .then(result => {
            res.status(200).json({ results: result.rows });
            console.log("Successfully fetched booking!");
        })
        .catch(err => {
            res.status(404).json({ message: "Encountered problem fetching bookings.", err });
            console.log(err);
    });   
}

/** 
 *
 * Nothing to provide.
 *  
*/
function get_bookings(req, res, next) {
    console.log(req.params);

    pool.query(queries.get_all_bookings)
        .then(result => {
            res.status(200).json({ results: result.rows });
            console.log("Successfully fetched booking!");
        })
        .catch(err => {
            res.status(404).json({ message: "Encountered problem fetching bookings.", err });
            console.log(err);
    });   
}

/**
 * 
 * Provide following in query string:
 * owner: String
 * pet_name: String
 * caretkaer: String
 * start_period: String - Format: YYYY-MM-DD
 * end_period: same as above
 * 
 * Provide following for data:
 * decision: Boolean - True for Accept / False for Decline
 * 
 */
function reply_booking(req, res, next) {
    const { owner, pet_name, caretaker, start_period, end_period } = req.params;
    const decision = req.body.decision;
    const query = decision ? queries.accept_booking : queries.decline_booking;

    pool.query(query, [owner, pet_name, caretaker, start_period, end_period])
        .then(result => {
            res.status(200).json({ message: "Booking updated!" });
            console.log("Successfully updated booking!");
        })
        .catch(err => {
            res.status(404).json({ message: "Encountered problem updating booking.", error: err });
            console.log(err);
    });
}

/**
 * 
 * Provide following in query string:
 * owner: String
 * pet_name: String
 * caretkaer: String
 * start_period: String - Format: YYYY-MM-DD
 * end_period: same as above
 * 
 * Provide following for data:
 * rating: integer - between 0 and 5
 * review: String
 * 
 */
function rate_booking(req, res, next) {
    const { owner, pet_name, caretaker, start_period, end_period } = req.params;
    const rating =  req.body["rating"] ? req.body.rating : null;
    const review =  req.body["review"] ? req.body.review : null;

    if(rating && review) {
        pool.query(queries.add_review_and_remark, [owner, pet_name, caretaker, start_period, end_period, rating, review])
            .then(result => {
                res.status(200).json({ message: "Booking updated!" });
                console.log("Successfully updated booking!");
            })
            .catch(err => {
                res.status(404).json({ message: "Encountered problem updating booking.", err });
                console.log(err);
        });
        return; 
    }

    if(review) {
        pool.query(queries.add_remark, [owner, pet_name, caretaker, start_period, end_period, review])
            .then(result => {
                res.status(200).json({ message: "Booking updated!" });
                console.log("Successfully updated booking!");
            })
            .catch(err => {
                res.status(404).json({ message: "Encountered problem updating booking.", err });
                console.log(err);
        });
        return;
    }

    if(rating) {
        pool.query(queries.add_review, [owner, pet_name, caretaker, start_period, end_period, rating])
            .then(result => {
                res.status(200).json({ message: "Booking updated!" });
                console.log("Successfully updated booking!");
            })
            .catch(err => {
                res.status(404).json({ message: "Encountered problem updating booking.", err });
                console.log(err);
        });
        return;
    }
}

/**
 * 
 * Provide following in query string:
 * owner: String
 * pet_name: String
 * caretkaer: String
 * start_period: String - Format: YYYY-MM-DD
 * end_period: same as above
 * 
 * Provide following for data:
 * rating: integer - between 0 and 5
 * review: String
 * 
 * OR
 * 
 * Provide following for data:
 * decision: Boolean - True for Accept / False for Decline
 * 
 */
function handlebooking(req, res, next) {
    if(req.body["rating"] || req.body["review"]) {
        rate_booking(req, res, next);
    } else if (req.body["decision"]) {
        reply_booking(req, res, next);
    } else {
        res.status(404).json({ message: "Encountered problem updating booking." });
    }
}
