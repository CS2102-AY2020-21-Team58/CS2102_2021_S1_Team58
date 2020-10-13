const sql = {}

sql.query = {

    // ABDUL
    

    // AAKANKSHA


    // ABHIMAN


    // WEI YANG
    search_caretaker: 'SELECT '
    /*
    This query is for searching for caretakers that are available,
    Note: section about t.day::date is for generating dates in a range to check if no. of pets in each day
    exceeds limit.

    Assumptions: caretaker table has ratings attributes.
    we let part-time caretakers with rating >= 4 to take care of up to 4 pets at a time (otherwise 2)

    variables: $1 start date, $2 end date, $3 pet type, $4 max price


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