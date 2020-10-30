const STATUS_ACCEPTED = "ACCEPTED";
const STATUS_PENDING = "PENDING";
const STATUS_DECLINED = "DECLINED";

module.exports.sql = sql = {};

sql.query = {
    
    // Variable: $1 = month INTEGER
    pets_taken_care_in_month: '\
    SELECT COUNT(*)\
    FROM bookings b1\
    WHERE status = \'ACCEPTED\' AND (DATE_PART(\'month\', b1.start_period) = $1 AND DATE_PART(\'month\', b1.end_period) = $1) OR \
                                (DATE_PART(\'month\', b1.start_period) < $1 AND DATE_PART(\'month\', b1.end_period) > $1) OR \
                                (DATE_PART(\'month\', b1.start_period) < $1 AND DATE_PART(\'month\', b1.end_period) = $1) OR \
                                (DATE_PART(\'month\', b1.start_period) = $1 AND DATE_PART(\'month\', b1.end_period) > $1)',

    get_month_where_max_pets_taken_care: '\
    SELECT month \
    FROM \
        (SELECT SUM(count1) AS jobs, month \
        FROM \
            (SELECT COUNT(*) AS count1, DATE_PART(\'month\', b1.start_period) AS month \
                            FROM bookings b1 GROUP BY DATE_PART(\'month\', b1.start_period) \
            UNION ALL \
            SELECT COUNT(*) AS count2, DATE_PART(\'month\', b1.end_period) AS month \
                                    FROM bookings b1 \
                                    WHERE DATE_PART(\'month\', b1.start_period) <> DATE_PART(\'month\', b1.end_period) \
                                    GROUP BY DATE_PART(\'month\', b1.end_period) \
            UNION ALL \
            SELECT COUNT(*) AS count3, DATE_PART(\'month\', month) AS month \
                                FROM (SELECT generate_series(date_trunc(\'month\',  start_period), end_period, \'1 month\')::date as month \
                                        FROM bookings \
                                        WHERE  DATE_PART(\'month\', end_period) - DATE_PART(\'month\', start_period) > 1) as temp \
                                        GROUP BY DATE_PART(\'month\', month)) as temp \
        GROUP BY month) as ans \
    ORDER BY jobs \
    DESC LIMIT 1;',

    //LOGIN: returns 1 if username-password combination exists. Get all details
    check_login_details: 'SELECT 1 FROM users WHERE username=$1 AND password=$2',
    get_user_details: 'SELECT * FROM users WHERE username=$1',

    //INSERT STUFF
    //Insert a user into the user table
    add_user: 'INSERT INTO users (username, password, first_name, location, card_number) VALUES($1, $2, $3, $4, $5)',
    //Insert a pet owner
    add_pet_owner: 'INSERT INTO owners (username) VALUES($1)',
    //Insert a care taker
    add_care_taker: 'INSERT INTO caretakers (username) VALUES($1)',
    //Insert a part time caretaker
    add_part_timer: 'INSERT INTO part_timers (username) VALUES($1)',
    //Insert a full time care taker
    add_full_timer: 'INSERT INTO full_timers (username) VALUES($1)',
    //Insert a PCS admin
    add_admin: 'INSERT INTO administrator (username) VALUES($1)',
    //Add a pet type
    add_pet_type_admin: 'INSERT INTO pet_types (animal_name, base_price) VALUES($1, $2)',
    //Add a pet
    add_pet: 'INSERT INTO pets (pet_name, type, owner) VALUES($1, $2, $3)',
    //Add service type by admin
    add_service_admin: 'INSERT INTO services (service_name) VALUES($1)',
    //Add pet type for care taker
    add_pet_type_caretaker: 'INSERT INTO handles (caretaker, animal_name, price) VALUES ($1, $2, $3)',
    //Add service for a care taker
    add_service_caretaker: 'INSERT INTO provides (caretaker, animal_name, service_name) VALUES ($1, $2, $3)',
    //Add service required for a pet
    add_service_pet: 'INSERT INTO requires (owner, pet_name, service_name) VALUES ($1, $2, $3)',
    //Add leave for full time care taker
    add_leave: 'INSERT INTO leave_dates(username, start_period, end_period) VALUES ($1, $2, $3)',
    //Add availability for part time care taker
    add_availability: 'INSERT INTO available_dates(username, start_period, end_period) VALUES ($1, $2, $3)',
    //Add a booking
    add_booking: 'INSERT INTO bookings(owner, pet_name, caretaker, start_period, end_period, payment_method, delivery_method, status, bid_rate, rating, remarks) VALUES ($1, $2, $3, $4::timestamp, $5::timestamp, $6, $7, $8, $9, $10, $11 )',
    add_initial_booking: 'INSERT INTO bookings(owner, pet_name, caretaker, start_period, end_period, payment_method, delivery_method, status, bid_rate, rating, remarks) VALUES ($1, $2, $3, $4::timestamp, $5::timestamp, $6, $7, $8, $9, NULL, NULL)',
    
    //UPDATES
    //Add rating
    add_review: 'UPDATE bookings SET rating = $6 WHERE owner = $1 AND pet_name = $2 AND caretaker = $3 AND start_period = $4 AND end_period = $5',
    //Add rating and remarks
    add_review_and_remark: 'UPDATE bookings SET rating = $6, remarks = $7  WHERE owner = $1 AND pet_name = $2 AND caretaker = $3 AND start_period = $4 AND end_period = $5',
    //Add just remarks
    add_remark: 'UPDATE bookings SET remarks = $6 WHERE owner = $1 AND pet_name = $2 AND caretaker = $3 AND start_period = $4 AND end_period = $5',
    //Accept a booking
    accept_booking: 'UPDATE bookings SET status = \'ACCEPTED\' WHERE owner = $1 AND pet_name = $2 AND caretaker = $3 AND start_period = $4 AND end_period = $5',
    //Decline a booking
    decline_booking: 'UPDATE bookings SET status = \'DECLINED\' WHERE owner = $1 AND pet_name = $2 AND caretaker = $3 AND start_period = $4 AND end_period = $5',
    //Update base price for a pet type
    update_base_price: 'UPDATE pet_types SET base_price = $2 WHERE animal_name = $1',
    //Update password
    update_password: 'UPDATE users SET password = $2  WHERE username = $1',
    //Update card number
    update_card: 'UPDATE users SET card_number = $2  WHERE username = $1',
    //Update location
    update_location: 'UPDATE users SET location = $2  WHERE username = $1',
    //Update rate caretaker
    update_caretaker_price: 'UPDATE handles SET price = $3 WHERE caretaker = $1 AND animal_name = $2',
    //Update average rating
    update_average_rating: 'UPDATE caretakers SET average_rating = $2  WHERE username = $1',

    //DELETION
    //Delete user
    delete_user: 'DELETE FROM users WHERE username = $1',
    //Delete pet owner
    delete_owner: 'DELETE FROM owners WHERE username = $1',
    //delete care taker
    delete_caretaker: 'DELETE FROM caretakers WHERE username = $1',
    //delete part timer
    delete_part_timer: 'DELETE FROM part_timers WHERE username = $1',
    //delete full timer
    delete_full_timer: 'DELETE FROM full_timers WHERE username = $1',
    //delete admin
    delete_admin: 'DELETE FROM administrator WHERE username = $1',
    //delete pet type
    delete_pet_type: 'DELETE FROM pet_types WHERE animal_name = $1',
    //delete pet
    delete_pet: 'DELETE FROM pets WHERE owner = $1 AND pet_name = $2',
    //delete a service type by admin
    delete_service_admin: 'DELETE FROM services WHERE service_name = $1',
    //delete pet type care taker takes care of
    delete_pet_type_caretaker: 'DELETE FROM handles WHERE caretaker = $1 AND animal_name = $2',
    //delete a service a caretaker provides for a pet type
    delete_service_caretaker: 'DELETE FROM provides WHERE caretaker = $1 AND animal_name = $2 AND service_name = $3',
    //delete a service a pet requires
    delete_service_pet: 'DELETE FROM requires WHERE owner = $1 AND pet_name = $2 AND service_name = $3',
    //delete leave
    delete_leave: 'DELETE FROM leave_dates WHERE username = $1 AND start_period = $2 AND end_period = $3',
    //delete availability
    delete_availability: 'DELETE FROM available_dates WHERE username = $1 AND start_period = $2 AND end_period = $3',
    //delete booking
    delete_booking: 'DELETE FROM bookings WHERE owner = $1 AND pet_name = $2 AND caretaker = $3 AND start_period = $4 AND end_period = $5',

    //BASIC QUERIES
    //Check if given username is in users table. Returns 1 if true.
    check_if_username_exists: 'SELECT COUNT(*) FROM users WHERE username=$1',
    //Check if given username is a petowner. Returns 1 if true.
    check_if_pet_owner: 'SELECT 1 FROM users WHERE username=$1',
    //check if given username is admin. Returns 1 if true.
    check_if_admin: 'SELECT 1 FROM administrator WHERE username=$1',
    //check if given username is caretaker. Returns 1 if true.
    check_if_caretaker: 'SELECT 1 FROM caretakers WHERE username=$1',
    //check if given username if part time care taker. Returns 1 if true.
    check_if_part_timer: 'SELECT 1 FROM part_timers WHERE username=$1',
    //check if given username is full time care taker. Returns 1 if true.
    check_if_full_timer: 'SELECT 1 FROM full_timers WHERE username=$1',
    //get number of bookings with review for a caretaker of given username
    get_num_of_reviews: 'SELECT COUNT(*) FROM bookings WHERE caretaker = $1 AND rating IS NOT NULL',
    //get caretakers with avg review below a particular value
    get_caretakers_with_poor_reviews: 'SELECT username FROM caretakers WHERE average_rating < $1 AND (SELECT COUNT(*) FROM bookings WHERE caretaker = username AND rating IS NOT NULL)',
    //get all services of a caretaker for a pet type
    get_caretaker_services: 'SELECT * FROM provides WHERE animal_name = $1 AND caretaker = $2',
    //get all care takers that can handle a pet type with prices and average review
    get_caretakers_prices: 'SELECT * FROM caretakers NATURAL JOIN handles WHERE animal_name = $1',
    //get pet types with prices that a caretaker can handle
    get_single_caretakers_prices: 'SELECT animal_name, price FROM handles WHERE caretaker = $1',
    //Get all caretakers in the same area as a given pet owner
    get_caretakers_in_area: 'SELECT U2.username FROM users U1, users U2, caretakers C WHERE U1.username = $1 AND C.username = U2.username AND U2.area = U1.area',
    //get pets of a pet owner
    get_pet_owners_pets: 'SELECT * FROM pets WHERE owner = $1',
    //Get all services of a pet
    get_services_of_a_pet: 'SELECT * FROM requires WHERE owner = $1 AND pet_name = $2',
    get_all_bookings: 'SELECT * FROM bookings',
    //pet owner views all bookings
    get_all_pet_owners_bookings: 'SELECT * FROM bookings WHERE owner = $1',
    //pet owner views all pending bookings
    get_all_pending_pet_owners_bookings: 'SELECT * FROM bookings WHERE owner = $1 AND status = \'PENDING\'',
    //pet owner views all accepted bookings
    get_all_accepted_pet_owners_bookings: 'SELECT * FROM bookings WHERE owner = $1 AND status = \'ACCEPTED\'',
    //pet owner views all declined bookings
    get_all_declined_pet_owners_bookings: 'SELECT * FROM bookings WHERE owner = $1 AND status = \'DECLINED\'',
    //pet owner views all bookings of a particular pet
    get_all_pets_bookings: 'SELECT * FROM bookings WHERE owner = $1 AND pet_name = $2',
    //pet owner views all pending bookings of a particular pet
    get_all_pending_pet_bookings: 'SELECT * FROM bookings WHERE owner = $1 AND pet_name = $2 AND status = \'PENDING\'',
    //pet owner views all accepted bookings of a particular pet
    get_all_accepted_pet_bookings: 'SELECT * FROM bookings WHERE owner = $1 AND pet_name = $2 AND status = \'ACCEPTED\'',
    //pet owner views all declined bookings of a particular pet
    get_all_declined_pet_bookings: 'SELECT * FROM bookings WHERE owner = $1 AND pet_name = $2 AND status = \'DECLINED\'',
    //full time care taker views all leaves
    get_all_full_timer_leaves: 'SELECT * FROM leave_dates WHERE username = $1',
    //part taker views all availabilities
    get_all_part_timer_availability: 'SELECT * FROM available_dates WHERE username = $1',
    //care taker views all bookings
    get_all_caretaker_bookings: 'SELECT * FROM bookings WHERE caretaker = $1',
    //care taker views all pending bookings
    get_all_pending_caretaker_bookings: 'SELECT * FROM bookings WHERE caretaker = $1 AND status = \'PENDING\'',
    //care taker views all accepted booking
    get_all_accepted_caretaker_bookings: 'SELECT * FROM bookings WHERE caretaker = $1 AND status = \'ACCEPTED\'',
    //care taker views all rejected bookings
    get_all_declined_caretakers_bookings: 'SELECT * FROM bookings WHERE caretaker = $1 AND status = \'DECLINED\'',
    //retrieve top 5 remarks + ratings of a care taker
    get_top_five_ratings: 'SELECT rating, remarks FROM bookings WHERE caretaker = $1 AND rating IS NOT NULL ORDER BY rating DESC LIMIT 5',
    //retrieve bottom 5 remarks + ratings of a care taker
    get_bottom_five_ratings: 'SELECT rating, remarks FROM bookings WHERE caretaker = $1 AND rating IS NOT NULL ORDER BY rating ASC LIMIT 5',
    //retrieve all remarks + ratings of a caretaker in ascending order
    get_ratings_asc: 'SELECT rating, remarks FROM bookings WHERE caretaker = $1 AND rating IS NOT NULL ORDER BY rating ASC',
    //retrieve all remarks + ratings of a caretaker in descending order
    get_ratings_desc: 'SELECT rating, remarks FROM bookings WHERE caretaker = $1 AND rating IS NOT NULL ORDER BY rating DESC',

    //SALARY QUERIES
    //get salary in given month for a particular part timer. $2 needs to be date in formal \'yyyy-mm-dd\'
    get_parttimer_salaries: 'SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) * bid_rate * 0.75 \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) * bid_rate * 0.75 \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) * bid_rate * 0.75 \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') * bid_rate * 0.75 \
        END) AS salary \
        FROM bookings \
        WHERE caretaker = $2 AND status = \'ACCEPTED\'',

    //get salary in the given month for a particular full timer.
    get_fulltimer_salaries: 'SELECT 3000 + 0.8 * (SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) * bid_rate \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) * bid_rate \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) * bid_rate \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') * bid_rate \
        END) AS salary \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\')/(SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
        END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') * ((SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
        END) AS salary \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') - 60) AS salary \
FROM caretakers C \
WHERE C.username = $2 AND ( \
SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
        END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') > 60 \
UNION \
SELECT 3000 AS salary \
FROM caretakers C \
WHERE C.username = $2 AND (SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
        END) \
        FROM bookings \
        WHERE caretaker = C.username AND status = \'ACCEPTED\') <= 60',

        //get list of caretaker username and salary to be paid to them
        get_salary_list: 'SELECT C.username AS cusername, COALESCE((SELECT SUM( \
            CASE \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) * bid_rate * 0.75 \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', end_period::date) * bid_rate * 0.75 \
                WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                    (end_period::date - start_period::date + 1) * bid_rate * 0.75 \
                WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                    DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') * bid_rate * 0.75 \
            END) \
            FROM bookings \
            WHERE caretaker = C.username AND status = \'ACCEPTED\'), 0) AS salary \
   FROM part_timers C \
   WHERE C.username IN (SELECT username FROM part_timers) \
   UNION \
   SELECT C.username AS cusername, 3000 + 0.8 * (SELECT SUM( \
            CASE \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) * bid_rate \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', end_period::date) * bid_rate \
                WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                    (end_period::date - start_period::date + 1) * bid_rate \
                WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                    DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') * bid_rate \
            END) \
   FROM bookings \
   WHERE caretaker = C.username AND status = \'ACCEPTED\')/(SELECT SUM( \
            CASE \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', end_period::date) \
                WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                    (end_period::date - start_period::date + 1) \
                WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                    DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
            END) \
   FROM bookings \
   WHERE caretaker = C.username AND status = \'ACCEPTED\') * ((SELECT SUM( \
            CASE \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', end_period::date) \
                WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                    (end_period::date - start_period::date + 1) \
                WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                    DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
            END) \
   FROM bookings \
   WHERE caretaker = C.username AND status = \'ACCEPTED\') - 60) AS salary \
   FROM full_timers C \
   WHERE C.username IN (SELECT username FROM full_timers) AND ( \
   SELECT SUM( \
            CASE \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', end_period::date) \
                WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                    (end_period::date - start_period::date + 1) \
                WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                    DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
            END) \
   FROM bookings \
   WHERE caretaker = C.username AND status = \'ACCEPTED\') > 60 \
   UNION \
   SELECT C.username AS cusername, 3000 AS salary \
   FROM full_timers C \
   WHERE C.username IN (SELECT username FROM full_timers) AND (SELECT SUM( \
    CASE \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', end_period::date) \
        WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
            (end_period::date - start_period::date + 1) \
        WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
            DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
    END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') <= 60 \
            OR (SELECT SUM( \
                CASE \
                    WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                        DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
                    WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                        DATE_PART(\'day\', end_period::date) \
                    WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                        (end_period::date - start_period::date + 1) \
                    WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                        DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
                END) \
            FROM bookings \
            WHERE caretaker = C.username AND status = \'ACCEPTED\') IS NULL',

    //total salary to be given in a particular month
    total_monthly_salary: 'SELECT SUM(salary) AS total_salary \
    FROM (SELECT C.username AS cusername, COALESCE((SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) * bid_rate * 0.75 \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) * bid_rate * 0.75 \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) * bid_rate * 0.75 \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') * bid_rate * 0.75 \
        END) \
        FROM bookings \
        WHERE caretaker = C.username AND status = \'ACCEPTED\'), 0) AS salary \
    FROM part_timers C \
    WHERE C.username IN (SELECT username FROM part_timers) \
    UNION \
    SELECT C.username AS cusername, 3000 + 0.8 * (SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) * bid_rate \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) * bid_rate \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) * bid_rate \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') * bid_rate \
        END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\')/(SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
        END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') * ((SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
        END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') - 60) AS salary \
FROM full_timers C \
WHERE C.username IN (SELECT username FROM full_timers) AND ( \
SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
        END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') > 60 \
UNION \
SELECT C.username AS cusername, 3000 AS salary \
FROM full_timers C \
WHERE C.username IN (SELECT username FROM full_timers) AND (SELECT SUM( \
CASE \
    WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
        DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
    WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
        DATE_PART(\'day\', end_period::date) \
    WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
        (end_period::date - start_period::date + 1) \
    WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
        DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') <= 60 \
        OR (SELECT SUM( \
            CASE \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
                WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                    DATE_PART(\'day\', end_period::date) \
                WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                    (end_period::date - start_period::date + 1) \
                WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                    DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
            END) \
        FROM bookings \
        WHERE caretaker = C.username AND status = \'ACCEPTED\') IS NULL) AS salaries',

    //display total revenue
    get_monthly_revenue: 'SELECT SUM( CASE \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) * bid_rate \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', end_period::date) * bid_rate \
        WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
            (end_period::date - start_period::date + 1) * bid_rate \
        WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
            DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') * bid_rate \
    END) AS revenue \
FROM bookings \
WHERE status = \'ACCEPTED\'',

    //get profit for a particular month
    get_monthly_profit: 'SELECT (SELECT SUM( CASE \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) * bid_rate \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', end_period::date) * bid_rate \
        WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
            (end_period::date - start_period::date + 1) * bid_rate \
        WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
            DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') * bid_rate \
    END) \
FROM bookings \
WHERE status = \'ACCEPTED\') - SUM(salary) AS profit \
FROM (SELECT C.username AS cusername, COALESCE((SELECT SUM( \
    CASE \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) * bid_rate * 0.75 \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', end_period::date) * bid_rate * 0.75 \
        WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
            (end_period::date - start_period::date + 1) * bid_rate * 0.75 \
        WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
            DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') * bid_rate * 0.75 \
    END) \
    FROM bookings \
    WHERE caretaker = C.username AND status = \'ACCEPTED\'), 0) AS salary \
FROM part_timers C \
WHERE C.username IN (SELECT username FROM part_timers) \
UNION \
SELECT C.username AS cusername, 3000 + 0.8 * (SELECT SUM( \
    CASE \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) * bid_rate \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', end_period::date) * bid_rate \
        WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
            (end_period::date - start_period::date + 1) * bid_rate \
        WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
            DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') * bid_rate \
    END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\')/(SELECT SUM( \
    CASE \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', end_period::date) \
        WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
            (end_period::date - start_period::date + 1) \
        WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
            DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
    END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') * ((SELECT SUM( \
    CASE \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', end_period::date) \
        WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
            (end_period::date - start_period::date + 1) \
        WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
            DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
    END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') - 60) AS salary \
FROM full_timers C \
WHERE C.username IN (SELECT username FROM full_timers) AND ( \
SELECT SUM( \
    CASE \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
            DATE_PART(\'day\', end_period::date) \
        WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
            (end_period::date - start_period::date + 1) \
        WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
            DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
    END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') > 60 \
UNION \
SELECT C.username AS cusername, 3000 AS salary \
FROM full_timers C \
WHERE C.username IN (SELECT username FROM full_timers) AND (SELECT SUM( \
CASE \
WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
    DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
    DATE_PART(\'day\', end_period::date) \
WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
    (end_period::date - start_period::date + 1) \
WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
    DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
END) \
FROM bookings \
WHERE caretaker = C.username AND status = \'ACCEPTED\') <= 60 \
    OR (SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period::date) + interval \'1 month\') - start_period::date) \
            WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period::date) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period::date) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period::date)) THEN \
                DATE_PART(\'day\', end_period::date) \
            WHEN DATE_PART(\'month\', start_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) = DATE_PART(\'year\', end_period::date) THEN \
                (end_period::date - start_period::date + 1) \
            WHEN DATE_PART(\'month\', start_period::date) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period::date) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period::date) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period::date) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
        END) \
    FROM bookings \
    WHERE caretaker = C.username AND status = \'ACCEPTED\') IS NULL) AS salaries',

    // $1 = Date in the month for which you need the data - give full date in YYYY-MM-DD format.
    caretakers_with_below_60: `SELECT DISTINCT u.username, u.first_name, (CASE WHEN b.sum IS NULL THEN 0 ELSE b.sum END) AS Days \
    FROM (users u NATURAL JOIN full_timers f) LEFT JOIN \
    (SELECT caretaker, SUM( \
      CASE \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', start_period) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'month\', end_period) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) < DATE_PART(\'year\', end_period)) THEN \
          DATE_PART(\'day\', (date_trunc(\'month\', start_period) + interval \'1 month\') - start_period) \
        WHEN DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) = DATE_PART(\'month\', end_period) AND (DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'month\', start_period) OR DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) > DATE_PART(\'year\', end_period)) THEN \
          DATE_PART(\'day\', end_period) \
        WHEN DATE_PART(\'month\', start_period) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period) = DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period) = DATE_PART(\'year\', end_period) THEN \
          (end_period - start_period + 1) \
        WHEN DATE_PART(\'month\', start_period) < DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'month\', end_period) > DATE_PART(\'month\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', start_period) <= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) AND DATE_PART(\'year\', end_period) >= DATE_PART(\'year\', CAST( $1 AS TIMESTAMP )) THEN \
          DATE_PART(\'day\', date_trunc(\'month\', CAST( $1 AS TIMESTAMP )) + interval \'1 month\' - interval \'1 day\') \
      END) \
    FROM bookings \
    WHERE status=\'${STATUS_ACCEPTED}\' \
    GROUP BY caretaker) as b ON b.caretaker=f.username \
    WHERE b.sum < 60 OR b.sum IS NULL`,

    // $1 = Name of caretaker
    // $2 = Date in the month for which you need the data
    pet_days_for_month: `SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', TIMESTAMP $2) = DATE_PART(\'month\', start_period) AND (DATE_PART(\'month\', TIMESTAMP $2) < DATE_PART(\'month\', end_period) OR DATE_PART(\'year\', TIMESTAMP $2) < DATE_PART(\'year\', end_period)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period) + interval \'1 month\') - start_period) \
            WHEN DATE_PART(\'month\', TIMESTAMP $2) = DATE_PART(\'month\', end_period) AND (DATE_PART(\'month\', TIMESTAMP $2) > DATE_PART(\'month\', start_period) OR DATE_PART(\'year\', TIMESTAMP $2) > DATE_PART(\'year\', end_period)) THEN \
                DATE_PART(\'day\', end_period) \
            WHEN DATE_PART(\'month\', start_period) = DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'month\', end_period) = DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'year\', start_period) = DATE_PART(\'year\', end_period) THEN \
                end_period - start_period + 1 \
            WHEN DATE_PART(\'month\', start_period) < DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'month\', end_period) > DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'year\', start_period) <= DATE_PART(\'year\', TIMESTAMP $2) AND DATE_PART(\'year\', end_period) >= DATE_PART(\'year\', TIMESTAMP $2) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', TIMESTAMP $2) + interval \'1 month\' - interval \'1 day\') \
        END) \
        FROM bookings \
        WHERE caretaker = $1 AND status = ${STATUS_ACCEPTED}`,

    // $1 = Name of caretaker
    caretaker_pending_bids: `SELECT caretaker, owner, pet_name, start_period, end_period, payment_method, delivery_method, bid_rate \
                            FROM bookings \
                            WHERE caretaker = $1 AND status = ${STATUS_PENDING}`,

    // $1 = Name of caretaker
    // $2 = Date in the month for which you need the data
    accepted_bids_for_month: `SELECT caretaker, owner, pet_name, start_period, end_period, payment_method, delivery_method, bid_rate, rating, remarks \
                            FROM bookings \
                            WHERE caretaker = $1 AND (DATE_PART(\'month\',TIMESTAMP $2) = DATE_PART(\'month\', start_period) OR DATE_PART(\'month\',TIMESTAMP $2) = DATE_PART(\'month\', end_period)) AND DATE_PART(\'year\', TIMESTAMP $2) = DATE_PART(\'year\', start_period) AND status = ${STATUS_ACCEPTED}`,


    // search_caretaker: search for caretakers available during entire period,
    // with less than 2/4/5 pets every day (for part-time/part-time rated 4/full time),
    // matches bid price and services

    // variables: $1 start date, $2 end date, $3 owner username, $4 pet name
    search_caretaker: 'SELECT U.username, U.first_name, H.price FROM users U, handles H WHERE CAST($1 AS DATE) <= CAST($2 AS DATE) \
    AND ((EXISTS(SELECT 1 FROM full_timers F WHERE F.username = U.username) \
                    AND NOT EXISTS(SELECT 1 FROM leave_dates L WHERE L.username = U.username\
                                AND (L.start_period BETWEEN CAST($1 AS DATE) AND CAST($2 AS DATE)\
                                    OR L.end_period BETWEEN CAST($1 AS DATE) AND CAST($2 AS DATE)\
                                    OR (L.start_period <= CAST($1 AS DATE) AND L.end_period >= CAST($1 AS DATE))\
                                    )\
                    )\
                )\
            OR (EXISTS(SELECT 1 FROM part_timers P WHERE P.username = U.username)\
                AND EXISTS(SELECT 1 FROM available_dates A\
                            WHERE A.start_period <= CAST($1 AS DATE)\
                                AND A.end_period >= CAST($2 AS DATE)\
                                AND A.username = U.username)\
                )\
    )\
    AND NOT EXISTS (SELECT CURRENT_DATE + i \
                    FROM generate_series(CAST($1 AS DATE) - CURRENT_DATE, CAST($2 AS DATE) - CURRENT_DATE) i\
                         WHERE (SELECT COUNT(*) FROM bookings B\
                                WHERE B.status = \'ACCEPTED\'\
                                AND B.caretaker = U.username\
                                AND CURRENT_DATE + i BETWEEN B.start_period AND B.end_period) >=\
                                (SELECT CASE\
                                  WHEN EXISTS(SELECT 1 FROM full_timers F WHERE F.username = U.username) THEN 5\
                                  WHEN (SELECT C.average_rating FROM caretakers C WHERE C.username = U.username) >= 4 THEN 4\
                                  ELSE 2\
                                  END\
                                )\
\
    )\
    AND H.animal_name = (SELECT type FROM pets WHERE pet_name = $4 AND owner = $3)\
    AND H.caretaker = U.username\
\
    AND NOT EXISTS (SELECT 1 FROM requires R\
                    WHERE R.pet_name = $4 AND R.owner = $3\
                    AND NOT EXISTS (SELECT 1 FROM provides P\
                                        WHERE P.caretaker = U.username\
                                        AND P.service_name = R.service_name\
                                        AND P.animal_name = (SELECT type FROM pets WHERE pet_name = $4 AND owner = $3)\
                                        )\
                      )\
    '
}
