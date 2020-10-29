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
    //month must be month number, year must be year number
    app.get('/salary_list/:date', get_all_salaries);
    app.get('/salary_total/:date', get_total_salaries);
    app.get('/revenue/:date', get_revenue);
    app.get('/profit/:date', get_profit);
    app.get('/salary/:usertype/:username/:date', get_user_salary);
    app.get('/underperforming_caretakers/:date', get_bad_caretakers);
    app.get('/top_ratings/:username', get_top_ratings);
    app.get('/worst_ratings/:username', get_worst_ratings);

    // UPDATE Methods
    //app.put('/route', function_name); // This is an example.

    // DELETE Methods
   // app.delete('/route/:id/:name', function_name); // This is an example.

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

function get_all_salaries(req, res, next) {
    console.log(req.params);
    const date = "\'" + req.params.date + "\'";
    console.log(date);
    let query = queries.get_salary_list;
    pool.query(query, [date]).then(result => {
        res.status(200).json({results: result.rows});
    }).catch(err => {
        res.status(404).json({message: "Encountered problem fetching salaries.", error: err});
        console.log(err);
    });
}

function get_total_salaries(req, res, next) {
    console.log(req.params);
    const date = "\'" + req.params.date + "\'";
    let query = queries.total_monthly_salary;
    pool.query(query, [date]).then(result => {
        res.status(200).json(result.rows[0]);
    }).catch(err => {
        res.status(404).json({message: "Encountered problem fetching total salary.", error: err});
        console.log(err);
    })
}

function get_revenue(req, res, next) {
    console.log(req.params);
    const date = "\'" + req.params.date + "\'";
    let query = queries.get_monthly_revenue;
    pool.query(query, [date]).then(result => {
        res.status(200).json({results: result.rows[0]});
    }).catch(err => {
        res.status(404).json({message: "Encountered problem fetching total revenue.", error: err});
        console.log(err);
    })
}

function get_profit(req, res, next) {
    console.log(req.params);
    const date = "\'" + req.params.date + "\'";
    let query = queries.get_monthly_profit;
    pool.query(query, [date]).then(result => {
        res.status(200).json({results: result.rows[0]});
    }).catch(err => {
        res.status(404).json({message: "Encountered problem fetching profit.", error: err});
        console.log(err);
    })
}

function get_user_salary(req, res, next) {
    console.log(req.params);
    const date = "\'" + req.params.date + "\'";
    const usertype = req.params.usertype;
    const username = req.params.username;
    if (usertype == "Part_Timer") {
        query = queries.get_parttimer_salaries;
    } else {
        query = queries.get_fulltimer_salaries;
    }
    pool.query(query, [date, username]).then(result => {
        res.status(200).json({results: result.rows[0]});
    }).catch(err => {
        res.status(404).json({message: "Encountered problem fetching salary.", error: err});
        console.log(err);
    })
}

function get_bad_caretakers(req, res, next) {
    console.log(req.params);
    const date = "\'" + req.params.date + "\'";
    let query = queries.caretakers_with_below_60;
    pool.query(query, [date]).then(result => {
        res.status(200).json({results: result.rows});
    }).catch(err => {
        res.status(404).json({message: "Encountered problem fetching poor caretakers.", error: err});
        console.log(err);
    })
}

function get_top_ratings(req, res, next) {
    console.log(req.params);
    const username = req.params.username;
    let query = queries.get_top_five_ratings;
    pool.query(query, [username]).then(result => {
        res.status(200).json({results: result.rows});
    }).catch(err => {
        res.status(404).json({message: "Encountered problem fetching poor caretakers.", error: err});
        console.log(err);
    })
}

function get_worst_ratings(req, res, next) {
    console.log(req.params);
    const username = req.params.username;
    let query = queries.get_bottom_five_ratings;
    pool.query(query, [username]).then(result => {
        res.status(200).json({results: result.rows});
    }).catch(err => {
        res.status(404).json({message: "Encountered problem fetching poor caretakers.", error: err});
        console.log(err);
    })
}
