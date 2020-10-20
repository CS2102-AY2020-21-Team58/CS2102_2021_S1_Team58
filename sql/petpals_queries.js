const sql = {}

sql.query = {

    // ABDUL
    

    // AAKANKSHA


    // ABHIMAN

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

    pet_days_for_month: 'SELECT SUM( \
        CASE \
            WHEN DATE_PART(\'month\', TIMESTAMP $2) = DATE_PART(\'month\', start_period) AND (DATE_PART(\'month\', TIMESTAMP $2) < DATE_PART(\'month\', end_period) OR DATE_PART(\'year\', TIMESTAMP $2) < DATE_PART(\'year\', end_period)) THEN \
                DATE_PART(\'day\', (date_trunc(\'month\', start_period) + interval \'1 month\') - start_period) \
            WHEN DATE_PART(\'month\', TIMESTAMP $2) = DATE_PART(\'month\', end_period) AND (DATE_PART(\'month\', TIMESTAMP $2) > DATE_PART(\'month\', start_period) OR DATE_PART(\'year\', TIMESTAMP $2) > DATE_PART(\'year\', end_period)) THEN \
                DATE_PART(\'day\', end_period) \
            WHEN DATE_PART(\'month\', start_period) = DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'month\', end_period) = DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'year\', start_period) = DATE_PART(\'year\', end_period) THEN \
                end_period - start_period + 1 \
            WHEN DATE_PART(\'month\', start_period) < DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'month\', end_period) > DATE_PART(\'month\', TIMESTAMP $2) AND DATE_PART(\'year\', start_period) <= DATE_PART(\'year\', $2) AND DATE_PART(\'year\', end_period) >= DATE_PART(\'year\', TIMESTAMP $2) THEN \
                DATE_PART(\'day\', date_trunc(\'month\', TIMESTAMP $2) + interval \'1 month\' - interval \'1 day\') \
        END) \
        FROM bookings \
        WHERE caretaker = $1 AND status = \'accepted\'',

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

    caretaker_pending_bids: 'SELECT caretaker, owner, pet_name, start_period, end_period, payment_method, delivery_method, bid_rate \
                            FROM bookings \
                            WHERE caretaker = $1 AND status = \'pending\'',

    accepted_bids_for_month: 'SELECT caretaker, owner, pet_name, start_period, end_period, payment_method, delivery_method, bid_rate, rating, remarks \
                            FROM bookings \
                            WHERE caretaker = $1 AND (DATE_PART(\'month\',TIMESTAMP $2) = DATE_PART(\'month\', start_period) OR DATE_PART(\'month\',TIMESTAMP $2) = DATE_PART(\'month\', end_period)) AND DATE_PART(\'year\', TIMESTAMP $2) = DATE_PART(\'year\', start_period) AND status = \'accepted\''

    // WEI YANG

}