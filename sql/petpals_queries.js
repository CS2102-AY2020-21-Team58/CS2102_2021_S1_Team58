const sql = {}

sql.query = {

    // ABDULHUSEIN
    // Variables: $1 = Date in the month for which you need the data - give full date in YYYY-MM-DD format, $2 = caretaker,

    //retrieve the number of reviews of a particular caretaker
    ret_num_reviews: 'SELECT COUNT(*) FROM bookings WHERE caretaker = $1 AND rating IS NOT NULL',

    // Total number of pets taken care of in a particular month. 
    get_total_pets_cared_in_month = 'SELECT count(*) FROM bookings WHERE DATE_PART(\'month\', TIMESTAMP $1) = $2 GROUP BY date;'
    get_total_pets_cared_in_month1 = 'SELECT count(*) FROM bookings WHERE EXTRACT(MONTH FROM date) = $2 GROUP BY date;'

    



    for full timers:
    - If pet days for the months is less than 60, they get 3000 dollars. For any excess pet day, they get 0.8 * no. of pet days * their own base rate (the rest goes to us as profit)
    Part timers always get 0.75 * pet days * base rate









    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    
// $1 = username ,$2 = password, $3 = first_name, $4 = location, $5 = card_number
    // AAKANKSHA
    //LOGIN: returns 1 if username-password combination exists. Get all details
    check_login_details: 'SELECT COUNT(*) FROM users WHERE username=$1 AND password=$2',
    get_user_details: 'SELECT * FROM users WHERE username=$1',

    //INSERT STUFF
    //Insert a user into the user table
    add_user: 'INSERT INTO users (username, password, first_name, location, card_number) VALUES($1,$2, $3, $4, $5)',
    //Insert a pet owner
    add_pet_owner: 'INSERT INTO owners (username) VALUES($1)',
    //Insert a care taker
    add_care_taker: 'INSERT INTO caretakers (username, average_rating) VALUES($1, $2)',
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
    add_booking: 'INSERT INTO bookings(owner, pet_name, caretaker, start_period, end_period, payment_method, delivery_method, status, bid_rate, rating, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NULL, NULL )',

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
    update_caretaker_price: 'UPDATE handles SET price = $2 WHERE caretaker = $1',
    //Update average rating
    update_averate_rating: 'UPDATE caretakers SET average_rating = $2  WHERE username = $1',


    //BASIC QUERIES
    //Check if given username is in users table. Returns 1 if true.
    check_if_username_exists: 'SELECT COUNT(*) FROM users WHERE username=$1',
    //Check if given username is a petowner. Returns 1 if true.
    check_if_pet_owner: 'SELECT COUNT(*) FROM users WHERE username=$1',
    //check if given username is admin. Returns 1 if true.
    check_if_admin: 'SELECT COUNT(*) FROM administrator WHERE username=$1',
    //check if given username is caretaker. Returns 1 if true.
    check_if_caretaker: 'SELECT COUNT(*) FROM caretakers WHERE username=$1',
    //check if given username if part time care taker. Returns 1 if true.
    check_if_part_timer: 'SELECT COUNT(*) FROM part_timers WHERE username=$1',
    //check if given username is full time care taker. Returns 1 if true.
    check_if_full_timer: 'SELECT COUNT(*) FROM full_timers WHERE username=$1',
    //get number of bookings with review for a caretaker of given username
    get_num_of_reviews: 'SELECT COUNT(*) FROM bookings WHERE caretaker = $1 AND rating IS NOT NULL',
    //get caretakers with avg review below a particular value
    get_caretakers_with_poor_reviews: 'SELECT username FROM caretakers WHERE average_rating < $1 AND (SELECT COUNT(*) FROM bookings WHERE caretaker = username AND rating IS NOT NULL)',
    //get all services of a caretaker for a pet type
    get_caretaker_services: 'SELECT * FROM provides WHERE animal_name = $1 AND caretaker = $2',
    //get all care takers that can handle a pet type with prices and average review
    get_caretakers_prices: 'SELECT * FROM caretakers NATURAL JOIN handles WHERE animal_name = $1',
    //Get all caretakers in the same area as a given pet owner
    get_caretakers_in_area: 'SELECT U2.username FROM users U1, users U2, caretakers C WHERE U1.username = $1 AND C.username = U2.username AND U2.area = U1.area',
    //get pets of a pet owner
    get_pet_owners_pets: 'SELECT * FROM pets WHERE owner = $1',
    //Get all services of a pet
    get_services_of_a_pet: 'SELECT * FROM requires WHERE owner = $1 AND pet_name = $2',
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


    // ABHIMAN

        // $1 = Date in the month for which you need the data - give full date in YYYY-MM-DD format.
        caretakers_with_below_60: 'SELECT DISTINCT u.username, u.first_name, (CASE WHEN b.sum IS NULL THEN 0 ELSE b.sum END) AS Days \
        FROM (users u NATURAL JOIN full_timers f) LEFT JOIN \
        (SELECT caretaker, SUM( \
          CASE \
            WHEN DATE_PART(\'month\', TIMESTAMP $1) = DATE_PART(\'month\', start_period) AND (DATE_PART(\'month\', TIMESTAMP $1) < DATE_PART(\'month\', end_period) OR DATE_PART(\'year\', TIMESTAMP $1) < DATE_PART(\'year\', end_period)) THEN \
              DATE_PART(\'day\', (date_trunc(\'month\', start_period) + interval \'1 month\') - start_period) \
            WHEN DATE_PART(\'month\', TIMESTAMP $1) = DATE_PART(\'month\', end_period) AND (DATE_PART(\'month\', TIMESTAMP $1) > DATE_PART(\'month\', start_period) OR DATE_PART(\'year\', TIMESTAMP $1) > DATE_PART(\'year\', end_period)) THEN \
              DATE_PART(\'day\', end_period) \
            WHEN DATE_PART(\'month\', start_period) = DATE_PART(\'month\', TIMESTAMP $1) AND DATE_PART(\'month\', end_period) = DATE_PART(\'month\', TIMESTAMP $1) AND DATE_PART(\'year\', start_period) = DATE_PART(\'year\', end_period) THEN \
              (end_period - start_period + 1) \
            WHEN DATE_PART(\'month\', start_period) < DATE_PART(\'month\', TIMESTAMP $1) AND DATE_PART(\'month\', end_period) > DATE_PART(\'month\', TIMESTAMP $1) AND DATE_PART(\'year\', start_period) <= DATE_PART(\'year\', TIMESTAMP $1) AND DATE_PART(\'year\', end_period) >= DATE_PART(\'year\', TIMESTAMP $1) THEN \
              DATE_PART(\'day\', date_trunc(\'month\', TIMESTAMP $1) + interval \'1 month\' - interval \'1 day\') \
          END) \
        FROM bookings \
        GROUP BY caretaker) as b ON b.caretaker=f.username \
        WHERE b.sum < 60 OR b.sum IS NULL',
    
    
        // $1 = Date in the month for which you need the data
        monthly_salary_to_pay: 'SELECT SUM( \
            CASE \
                WHEN DATE_PART(\'month\', TIMESTAMP $1) = DATE_PART(\'month\', start_period) AND (DATE_PART(\'month\', TIMESTAMP $1) < DATE_PART(\'month\', end_period) OR DATE_PART(\'year\', TIMESTAMP $1) < DATE_PART(\'year\', end_period)) THEN \
                    DATE_PART(\'day\', (date_trunc(\'month\', start_period) + interval \'1 month\') - start_period) * bid_rate \
                WHEN DATE_PART(\'month\', TIMESTAMP $1) = DATE_PART(\'month\', end_period) AND (DATE_PART(\'month\', TIMESTAMP $1) > DATE_PART(\'month\', start_period) OR DATE_PART(\'year\', TIMESTAMP $1) > DATE_PART(\'year\', end_period)) THEN \
                    DATE_PART(\'day\', end_period) * bid_rate \
                WHEN DATE_PART(\'month\', start_period) = DATE_PART(\'month\', TIMESTAMP $1) AND DATE_PART(\'month\', end_period) = DATE_PART(\'month\', TIMESTAMP $1) AND DATE_PART(\'year\', start_period) = DATE_PART(\'year\', end_period) THEN \
                    (end_period - start_period + 1) * bid_rate \
                WHEN DATE_PART(\'month\', start_period) < DATE_PART(\'month\', TIMESTAMP $1) AND DATE_PART(\'month\', end_period) > DATE_PART(\'month\', TIMESTAMP $1) AND DATE_PART(\'year\', start_period) <= DATE_PART(\'year\', $1) AND DATE_PART(\'year\', end_period) >= DATE_PART(\'year\', TIMESTAMP $1) THEN \
                    DATE_PART(\'day\', date_trunc(\'month\', TIMESTAMP $1) + interval \'1 month\' - interval \'1 day\') * bid_rate \
            END) \
            FROM bookings \
            WHERE status = \'accepted\'',
    
        // $1 = Name of caretaker
        // $2 = Date in the month for which you need the data
        pet_days_for_month: 'SELECT SUM( \
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
            WHERE caretaker = $1 AND status = \'accepted\'',
    
        // $1 = Name of caretaker
        // $2 = Date in the month for which you need the data
        expected_salary_for_month: 'SELECT SUM( \
            CASE \
                WHEN DATE_PART(\'month\', TIMESTAMP $2) = DATE_PART(\'month\', start_period) AND (DATE_PART(\'month\', TIMESTAMP $2) < DATE_PART(\'month\', end_period) OR DATE_PART(\'year\', TIMESTAMP $2) < DATE_PART(\'year\', end_period)) THEN \
                    DATE_PART(\'day\', (date_trunc(\'month\', start_period) + interval \'1 month\') - start_period) * bid_rate \
                WHEN DATE_PART(\'month\', TIMESTAMP $2) = DATE_PART(\'month\', end_period) AND (DATE_PART(\'month\', TIMESTAMP $2) > DATE_PART(\'month\', start_period) OR DATE_PART(\'year\', TIMESTAMP $2) > DATE_PART(\'year\', end_period)) THEN \
                    DATE_PART(\'day\', end_period) * bid_rate \
                WHEN DATE_PART(\'month\', start_period) = DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'month\', end_period) = DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'year\', start_period) = DATE_PART(\'year\', end_period) THEN \
                    (end_period - start_period + 1) * bid_rate \
                WHEN DATE_PART(\'month\', start_period) < DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'month\', end_period) > DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'year\', start_period) <= DATE_PART(\'year\', $2) AND DATE_PART(\'year\', end_period) >= DATE_PART(\'year\', TIMESTAMP $2) THEN \
                    DATE_PART(\'day\', date_trunc(\'month\', TIMESTAMP $2) + interval \'1 month\' - interval \'1 day\') * bid_rate \
            END) \
            FROM bookings \
            WHERE caretaker = $1 AND status = \'accepted\'',
    
        // $1 = Name of caretaker
        caretaker_pending_bids: 'SELECT caretaker, owner, pet_name, start_period, end_period, payment_method, delivery_method, bid_rate \
                                FROM bookings \
                                WHERE caretaker = $1 AND status = \'pending\'',
    
        // $1 = Name of caretaker
        // $2 = Date in the month for which you need the data
        accepted_bids_for_month: 'SELECT caretaker, owner, pet_name, start_period, end_period, payment_method, delivery_method, bid_rate, rating, remarks \
                                FROM bookings \
                                WHERE caretaker = $1 AND (DATE_PART(\'month\',TIMESTAMP $2) = DATE_PART(\'month\', start_period) OR DATE_PART(\'month\',TIMESTAMP $2) = DATE_PART(\'month\', end_period)) AND DATE_PART(\'year\', TIMESTAMP $2) = DATE_PART(\'year\', start_period) AND status = \'accepted\''
    

    // WEI YANG
    search_caretaker: 'SELECT '
    
    // This query is for searching for caretakers that are available,
    // Note: section about t.day::date is for generating dates in a range to check if no. of pets in each day
    // exceeds limit.
    // Assumptions: caretaker table has ratings attributes.
    // we let part-time caretakers with rating >= 4 to take care of up to 4 pets at a time (otherwise 2)
    // variables: $1 start date, $2 end date, $3 pet type, $4 max price
    SELECT username, first_name
    FROM users U
    WHERE
    $1 >= NOW() AND $2 >= $1
      AND (
      (EXISTS(SELECT 1 FROM full_timers F WHERE F.username = U.username)
         AND NOT EXISTS(SELECT 1 FROM leave_dates L
                        WHERE L.username = U.username
                        AND (
                          L.start_period BETWEEN $1 AND $2
                          OR (L.start_period <= $1
                              AND L.end_period >= $1)
                          )
                        )
        )
        OR
        (EXISTS(SELECT 1 FROM part_timers P WHERE P.username = U.username)
        AND EXISTS(SELECT 1 FROM available_dates A
                   WHERE A.start_period <= $1
                   AND A.end_period >= $2)
        )
      )
      AND NOT EXISTS (SELECT 1 FROM generate_series(timestamp $1, timestamp $2, interval '1 day') AS T(day)
                         WHERE (SELECT COUNT(*) FROM bookings B
                                WHERE B.status = 'accepted'
                                AND B.caretaker == U.username
                                AND T.day BETWEEN B.start_period AND B.end_period) >=
                                (SELECT CASE
                                        WHEN EXISTS(SELECT 1 FROM full_timers F WHERE F.username = U.username) THEN 5
                                        WHEN () >= 4 THEN 4
                                        ELSE 2
                                )
                         )
      AND EXISTS (SELECT 1 FROM handles H WHERE H.username = U.username AND H.animal_name = $3 AND H.price <= $4)
     */
}