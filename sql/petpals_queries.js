const sql = {}

sql.query = {

    // ABDULHUSEIN
    // Variables: $1 = Date in the month for which you need the data - give full date in YYYY-MM-DD format, $2 = caretaker,

    //retrieve the number of reviews of a particular caretaker
    ret_num_reviews: 'SELECT COUNT(*) FROM bookings WHERE caretaker = $1 AND rating IS NOT NULL',

    // Total number of pets taken care of in a particular month. 
    get_total_pets_cared_in_month = 'SELECT count(*) FROM bookings WHERE DATE_PART(\'month\', TIMESTAMP $1) = $2 GROUP BY date;'
    get_total_pets_cared_in_month1 = 'SELECT count(*) FROM bookings WHERE EXTRACT(MONTH FROM date) = $2 GROUP BY date;'

    



    // for full timers:
    // - If pet days for the months is less than 60, they get 3000 dollars. For any excess pet day, they get 0.8 * no. of pet days * their own base rate (the rest goes to us as profit)
    // Part timers always get 0.75 * pet days * base rate










}