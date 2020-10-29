// import { sql } from "../sql/petpals_queries";

const queries = require("../sql/petpals_queries").sql.query;
// Postgre SQL Connection
const { Pool } = require('pg');

// Change Database Settings Here BEFORE DEPLOYMENT
const pool = new Pool({
	user: 'me',
    password: 'password',
    host: 'localhost',
    database: 'petpals_real',
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
    app.get('/salaryall/:date', get_all_salaries);

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



