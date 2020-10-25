STATUS_ACCEPTED = "ACCEPTED";
STATUS_PENDING = "PENDING";
STATUS_DECLINED = "DECLINED";

const sql = {}

sql.query = {

    // ABDUL
    

    // AAKANKSHA


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

}