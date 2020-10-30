// import { sql } from "../sql/petpals_queries";

const queries = require("../sql/petpals_queries").sql.query;
// Postgre SQL Connection
const { Pool } = require('pg');

// Change Database Settings Here BEFORE DEPLOYMENT
const pool = new Pool({
	user: 'postgres',
    password: 'password',
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
    app.post('/:user/caretakers/leaves_availability', add_leave_or_availability);
    app.post('/:user/caretakers/services', add_caretaker_animals);
    app.post('/:user/caretakers/services/:animal_name', add_caretaker_services);

    // // GET Methods
    app.get('/petsofowner/:username', get_pets_of_owner);
    app.get('/allservices/', get_all_services);
    app.get('/pendingbids/', get_pending_bids);
    app.get('/monthmaxjobs/', get_month_of_max_jobs);
    app.get('/jobsinmaxjobsmonth/', get_jobs_max_job_month);
    app.get('/sameareacaretaker/:location', get_same_area_caretaker);

    // // UPDATE Methods
    // app.put('/route', function_name); // This is an example.

    // // DELETE Methods
    // app.delete('/route/:id/:name', function_name); // This is an example.

    // GET Methods
    app.get('/:user/owners/search/caretakers/:start_period/:end_period/:pet_name', get_available_caretakers);
    app.get('/:user/caretakers/leaves_availability', get_leave_or_availability);
    app.get('/:user/caretakers/services', get_caretaker_animals);
    app.get('/:user/caretakers/services/:animal_name', get_caretaker_services);
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
    app.put('/:user/caretakers/services', update_caretaker_animals);

    // DELETE Methods
    app.delete('/:user/caretakers/leaves_availability', delete_leave_or_availability);
    app.delete('/:user/caretakers/services', delete_caretaker_animals);
    app.delete('/:user/caretakers/services/:animal_name', delete_caretaker_services);
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

/**
 * 
 * Provide following in path:
 * location area: String
 * 
 */
function get_same_area_caretaker(req, res, next) {
    console.log(req.params);
    const location = req.params.location;
    pool.query(queries.get_caretakers_same_area, [location])
    .then(result => {
        console.log(result);
        res.status(200).json({ results: result.rows });
        console.log("Successfully got Cartakers in same area");
    })
    .catch(err => {
        res.status(404).json({ message: "Encountered problems getting caretakers in same area", error: err }).send(error);
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

/**
 *
 * Provide the following in path:
 * username: String
 *
 */
function get_caretaker_animals(req, res, next) {
    console.log(req);
    const username = req.params.user;

    pool.query(queries.get_single_caretakers_prices, [username])
        .then(result => {
            res.status(200).json({ results: result.rows });
            console.log("Successfully fetched animals for caretaker!");
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem fetching animals for caretaker.", error: err});
            console.log(err);
        });
}

/**
 *
 * Provide the following in path:
 * username: String
 *
 * Provide the following in request body:
 * animal_name: String, must be from list of pet types
 * price: numeric
 *
 */
function add_caretaker_animals(req, res, next) {
    console.log(req);
    const username = req.params.user;
    const animal_name = req.body.animal_name;
    const price = req.body.price;

    pool.query(queries.add_pet_type_caretaker, [username, animal_name, price])
        .then(result => {
            res.status(200).json({ results: result.rows });
            console.log("Successfully adding animal type for caretaker!");
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem adding animal type for caretaker.", error: err});
            console.log(err);
        });
}

/**
 *
 * Provide the following in path:
 * username: String
 *
 * Provide the following in request body:
 * animal_name: String, must be from list of pet types
 *
 */
function delete_caretaker_animals(req, res, next) {
    console.log(req);
    const username = req.params.user;
    const animal_name = req.body.animal_name;

    pool.query(queries.delete_pet_type_caretaker, [username, animal_name])
        .then(result => {
            res.status(200).json({ results: result.rows });
            console.log("Successfully deleted animal type for caretaker!");
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem deleting animal type for caretaker.", error: err});
            console.log(err);
        });
}

/**
 *
 * Provide the following in path:
 * username: String
 *
 * Provide the following in request body:
 * animal_name: String, must be from list of pet types
 * price: numeric (modified field)
 *
 */
function update_caretaker_animals(req, res, next) {
    console.log(req);
    const username = req.params.user;
    const animal_name = req.body.animal_name;
    const price = req.body.price;

    pool.query(queries.update_caretaker_price, [username, animal_name, price])
        .then(result => {
            res.status(200).json({ results: result.rows });
            console.log("Successfully updated price for caretaker!");
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem updating price for caretaker.", error: err});
            console.log(err);
        });
}

/**
 *
 * Provide the following in path:
 * username: String
 * animal_name: String, from pet_types table
 *
 */
function get_caretaker_services(req, res, next) {
    console.log(req);
    const username = req.params.user;
    const animal_name = req.params.animal_name;

    pool.query(queries.get_caretaker_services, [animal_name, username])
        .then(result => {
            res.status(200).json({ results: result.rows });
            console.log("Successfully fetched services for caretaker!");
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem fetching services for caretaker.", error: err});
            console.log(err);
        });
}

/**
 *
 * Provide the following in path:
 * username: String
 * animal_name: String, from pet_types table
 *
 * Provide the following in request body:
 * service: String, from services table
 *
 */
function add_caretaker_services(req, res, next) {
    console.log(req);
    const username = req.params.user;
    const animal_name = req.params.animal_name;
    const service = req.body.service;

    pool.query(queries.add_service_caretaker, [username, animal_name, service])
        .then(result => {
            res.status(200).json({ results: result.rows });
            console.log("Successfully added service for caretaker!");
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem adding service for caretaker.", error: err});
            console.log(err);
        });
}

/**
 *
 * Provide the following in path:
 * username: String
 * animal_name: String, from pet_types table
 *
 * Provide the following in request body:
 * service: String, from services table
 *
 */
function delete_caretaker_services(req, res, next) {
    console.log(req);
    const username = req.params.user;
    const animal_name = req.params.animal_name;
    const service = req.body.service;

    pool.query(queries.delete_service_caretaker, [username, animal_name, service])
        .then(result => {
            res.status(200).json({ results: result.rows });
            console.log("Successfully deleted service for caretaker!");
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem deleting service for caretaker.", error: err});
            console.log(err);
        });
}

/**
 *
 * Provide the following in path:
 * start_period: String, Format: YYYY-MM-DD or DD/MM/YYYY
 * end_period: String, Format: YYYY-MM-DD or DD/MM/YYYY
 * owner: String (owner username from pets table)
 * pet_name: String
 *
 */
function get_available_caretakers(req, res, next) {
    console.log(req);
    const start_period = req.params.start_period;
    const end_period = req.params.end_period;
    const username = req.params.user;
    const pet_name = req.params.pet_name;

    pool.query(queries.search_caretaker, [start_period, end_period, username, pet_name])
        .then(result => {
            res.status(200).json({ results: result.rows });
            console.log("Successfully fetched available caretakers!");
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem finding available caretakers.", error: err});
            console.log(err);
        });
}

/**
 *
 * Provide the following in path:
 * username: String
 *
 * Provide the following in request body:
 * start_period: String, Format: YYYY-MM-DD or DD/MM/YYYY
 * end_period: String, Format: YYYY-MM-DD or DD/MM/YYYY
 *
 */
function add_leave_or_availability(req, res, next) {
    console.log(req);
    const username = req.params.user;
    const start_period = req.body.start_period;
    const end_period = req.body.end_period;

    pool.query(queries.check_if_part_timer, [username])
        .then(result => {
            if (result.rows[0].count == "1") {
                pool.query(queries.add_availability, [username, start_period, end_period])
                    .then(result => {
                        res.status(200).json({results: result.rows});
                        console.log("Successfully added availability!");
                    })
                    .catch(err => {
                        res.status(404).json({
                            message: "Encountered problem adding availability.",
                            error: err
                        });
                        console.log(err);
                    });
            } else {
                pool.query(queries.check_if_full_timer, [username])
                    .then(result => {
                        if (result.rows[0].count == "1") {
                            pool.query(queries.add_leave, [username, start_period, end_period])
                                .then(result => {
                                    res.status(200).json({results: result.rows});
                                    console.log("Successfully added leave!");
                                })
                                .catch(err => {
                                    res.status(404).json({
                                        message: "Encountered problem adding leave.",
                                        error: err
                                    });
                                    console.log(err);
                                });
                        } else {
                            res.status(404).json({
                                message: "Encountered problem adding leaves or availability.",
                                error: "User not a caretaker"
                            });
                            console.log("User not a caretaker.");
                        }
                    });
            }
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem adding leaves or availability.", error: err});
            console.log(err);
        });
}

/**
 *
 * Provide the following in path:
 * username: String
 *
 * Provide the following in request body:
 * start_period: String, Format: YYYY-MM-DD or DD/MM/YYYY
 * end_period: String, Format: YYYY-MM-DD or DD/MM/YYYY
 *
 */
function delete_leave_or_availability(req, res, next) {
    console.log(req);
    const username = req.params.user;
    const start_period = req.body.start_period;
    const end_period = req.body.end_period;

    pool.query(queries.check_if_part_timer, [username])
        .then(result => {
            if (result.rows[0].count == "1") {
                pool.query(queries.delete_availability, [username, start_period, end_period])
                    .then(result => {
                        res.status(200).json({results: result.rows});
                        console.log("Successfully deleted availability!");
                    })
                    .catch(err => {
                        res.status(404).json({
                            message: "Encountered problem deleting availability.",
                            error: err
                        });
                        console.log(err);
                    });
            } else {
                pool.query(queries.check_if_full_timer, [username])
                    .then(result => {
                        if (result.rows[0].count == "1") {
                            pool.query(queries.delete_leave, [username, start_period, end_period])
                                .then(result => {
                                    res.status(200).json({results: result.rows});
                                    console.log("Successfully deleted leave!");
                                })
                                .catch(err => {
                                    res.status(404).json({
                                        message: "Encountered problem deleting leave.",
                                        error: err
                                    });
                                    console.log(err);
                                });
                        } else {
                            res.status(404).json({
                                message: "Encountered problem deleting leaves or availability.",
                                error: "User not a caretaker"
                            });
                            console.log("User not a caretaker.");
                        }
                    });
            }
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem deleting leaves or availability.", error: err});
            console.log(err);
        });
}


/**
 *
 * Provide the following in path:
 * username: String
 *
 */
function get_leave_or_availability(req, res, next) {
    console.log(req);
    const username = req.params.user;

    pool.query(queries.check_if_part_timer, [username])
        .then(result => {
            if (result.rows[0].count == "1") {
                pool.query(queries.get_all_part_timer_availability, [username])
                    .then(result => {
                    res.status(200).json({ results: result.rows });
                    console.log("Successfully fetched availability!");
                    })
                    .catch(err => {
                        res.status(404).json({message: "Encountered problem finding availability.", error: err});
                        console.log(err);
                    });
            } else {
                pool.query(queries.check_if_full_timer, [username])
                    .then(result => {
                        if (result.rows[0].count == "1") {
                            pool.query(queries.get_all_full_timer_leaves, [username])
                                .then(result => {
                                    res.status(200).json({results: result.rows});
                                    console.log("Successfully fetched leaves!");
                                })
                                .catch(err => {
                                    res.status(404).json({
                                        message: "Encountered problem finding leaves.",
                                        error: err
                                    });
                                    console.log(err);
                                });
                        } else {
                            res.status(404).json({
                                message: "Encountered problem finding leaves or availability.",
                                error: "User not a caretaker"
                            });
                            console.log("User not a caretaker.");
                        }
                    });
            }
        })
        .catch(err => {
            res.status(404).json({message: "Encountered problem finding leaves or availability.", error: err});
            console.log(err);
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
