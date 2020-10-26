CREATE TABLE users (
	username    varchar(64)  PRIMARY KEY,
	password    varchar(64)  NOT NULL,
	first_name  varchar(64)  NOT NULL,
    location    varchar(64)  NOT NULL,
    card_number varchar(16)  NOT NULL
);

CREATE TABLE administrator (
    username varchar(64) references users(username) PRIMARY KEY
);

CREATE TABLE caretakers (
    username varchar(64) references users(username) PRIMARY KEY,
    average_rating numeric check(average_rating >= 0 AND average_rating <= 5)
);

CREATE TABLE owners (
    username varchar(64) references users(username) PRIMARY KEY
);

CREATE TABLE part_timers (
    username varchar(64) references caretakers(username) PRIMARY KEY
);

CREATE TABLE full_timers (
    username varchar(64) references caretakers(username) PRIMARY KEY
);

CREATE TABLE available_dates (
    username     varchar(64) references part_timers(username),
    start_period date NOT NULL, 
    end_period   date NOT NULL,
    PRIMARY KEY(username, start_period, end_period)
);

CREATE TABLE leave_dates (
    username     varchar(64) references full_timers(username),
    start_period date NOT NULL, 
    end_period   date NOT NULL,
    PRIMARY KEY(username, start_period, end_period)
);

CREATE TABLE pet_types (
    animal_name varchar(64) PRIMARY KEY,
    base_price  numeric NOT NULL
);

CREATE TABLE services (
    service_name varchar(64) PRIMARY KEY
);

CREATE FUNCTION getMinimumPrice(varchar)
RETURNS NUMERIC AS $$
  DECLARE price NUMERIC;
  BEGIN
          SELECT  base_price INTO price
          FROM    pet_types
          WHERE   animal_name = $1;

          RETURN price;
  END;
$$ LANGUAGE plpgsql;

CREATE TABLE handles (
    caretaker   varchar(64) references caretakers(username),
    animal_name varchar(64) references pet_types(animal_name),
    price       numeric     NOT NULL check(price >= getMinimumPrice(animal_name)),
    PRIMARY KEY(caretaker, animal_name)
);

CREATE TABLE provides (
    caretaker    varchar(64),
    animal_name  varchar(64),
    service_name varchar(64) references services(service_name),
    FOREIGN KEY(caretaker, animal_name) references handles(caretaker, animal_name),
    PRIMARY KEY(caretaker, animal_name, service_name)
);

CREATE TABLE pets (
    pet_name varchar(64),
    type varchar(64)  references pet_types(animal_name),
    owner varchar(64) references owners(username) ON DELETE CASCADE,
    PRIMARY KEY(pet_name, owner)
);

CREATE TABLE requires (
    owner varchar(64),
    pet_name varchar(64),
    service_name varchar(64)     references services(service_name),
    FOREIGN KEY(owner, pet_name) references pets(owner, pet_name),
    PRIMARY KEY(owner, pet_name, service_name)
);

CREATE FUNCTION getMinimumAskingPrice(varchar, varchar, varchar)
RETURNS NUMERIC AS $$
  DECLARE rate NUMERIC;
  BEGIN
          SELECT  price INTO rate
          FROM    handles
          WHERE   caretaker = $1 AND animal_name = (SELECT type FROM pets WHERE pet_name = $3 AND owner = $2);

          RETURN rate;
  END;
$$ LANGUAGE plpgsql;

CREATE TABLE bookings (
    owner varchar(64),
    pet_name varchar(64),
    caretaker varchar(64) references caretakers(username),
    start_period date, 
    end_period date check(end_period >= start_period),
    payment_method varchar(64) NOT NULL,
    delivery_method varchar(64) NOT NULL,
    status varchar(64) NOT NULL,
    bid_rate numeric NOT NULL check(bid_rate >= getMinimumAskingPrice(caretaker, owner, pet_name)),
    rating numeric check(rating >= 0 AND rating <= 5),
    remarks varchar(1000),
    FOREIGN KEY(owner, pet_name) references pets(owner, pet_name),
    PRIMARY KEY(owner, pet_name, caretaker, start_period, end_period)
);

<<<<<<< HEAD
CREATE OR REPLACE FUNCTION update_caretaker_rates_on_new() RETURNS trigger AS $ret$
	BEGIN
		UPDATE handles
		SET price=NEW.base_price
		WHERE price < NEW.base_price;
        RETURN NEW;
	END;    
$ret$ LANGUAGE plpgsql;

CREATE TRIGGER update_caretaker_rates
	AFTER UPDATE ON pet_types
	FOR EACH ROW
	EXECUTE PROCEDURE update_caretaker_rates_on_new();


CREATE OR REPLACE FUNCTION update_fulltimer_booking() RETURNS trigger as $ret$
    BEGIN
        IF NEW.caretaker IN (SELECT username FROM full_timers) AND 
            NOT EXISTS (SELECT *
                        FROM (SELECT NEW.start_period + (interval '1' month * generate_series(0, CAST((DATE_PART('month', NEW.end_period) - DATE_PART('month', NEW.start_period)) AS INTEGER))) AS day) AS interval_months
                        WHERE (SELECT SUM(
                            CASE
                            WHEN DATE_PART('month', interval_months.day) = DATE_PART('month', start_period) AND (DATE_PART('month', interval_months.day) < DATE_PART('month', end_period) OR DATE_PART('year', interval_months.day) < DATE_PART('year', end_period)) THEN
                            DATE_PART('day', (date_trunc('month', start_period) + interval '1 month') - start_period)
                            WHEN DATE_PART('month', interval_months.day) = DATE_PART('month', end_period) AND (DATE_PART('month', interval_months.day) > DATE_PART('month', start_period) OR DATE_PART('year', interval_months.day) > DATE_PART('year', end_period)) THEN
                            DATE_PART('day', end_period)
                            WHEN DATE_PART('month', start_period) = DATE_PART('month', interval_months.day) AND DATE_PART('month', end_period) = DATE_PART('month', interval_months.day) AND DATE_PART('year', start_period) = DATE_PART('year', end_period) THEN
                            end_period - start_period + 1
                            WHEN DATE_PART('month', start_period) < DATE_PART('month', interval_months.day) AND DATE_PART('month', end_period) > DATE_PART('month', interval_months.day) AND DATE_PART('year', start_period) <= DATE_PART('year', interval_months.day) AND DATE_PART('year', end_period) >= DATE_PART('year', interval_months.day) THEN
                            DATE_PART('day', date_trunc('month', interval_months.day) + interval '1 month' - interval '1 day')
                            END)
                                FROM (SELECT * FROM bookings EXCEPT SELECT * FROM bookings WHERE NEW.owner=owner AND NEW.pet_name=pet_name AND NEW.caretaker=caretaker AND NEW.start_period=start_period AND NEW.end_period=end_period) AS b
                                WHERE caretaker=NEW.caretaker) > 60) AND 
            NOT EXISTS (SELECT *
                        FROM (SELECT NEW.start_period + (interval '1' day * generate_series(0, (CAST(DATE_PART('day', NEW.end_period) AS INTEGER) - CAST(DATE_PART('day', NEW.start_period) AS INTEGER)))) AS days) AS dates
                        WHERE (SELECT COUNT(*) FROM bookings b WHERE b.caretaker=NEW.caretaker AND b.start_period<=dates.days AND b.end_period>=dates.days) = 5)
        THEN UPDATE bookings SET "status" = 'ACCEPTED' WHERE NEW.owner=owner AND NEW.pet_name=pet_name AND NEW.caretaker=caretaker AND NEW.start_period=start_period AND NEW.end_period=end_period;
        END IF;
        RETURN NEW;
    END;
$ret$ LANGUAGE plpgsql;
    
CREATE TRIGGER direct_accept
    AFTER INSERT ON bookings
    FOR EACH ROW
    EXECUTE PROCEDURE update_fulltimer_booking();


=======
CREATE OR REPLACE FUNCTION not_full_timer() RETURNS TRIGGER AS $trig$
DECLARE ctx NUMERIC;
BEGIN
SELECT COUNT(*) INTO ctx FROM full_timers FT
WHERE NEW.username = FT.username;
IF ctx > 0 THEN
RETURN NULL;
ELSE
RETURN NEW;
END IF; END; 
$trig$ LANGUAGE plpgsql;

CREATE TRIGGER check_part_timer
BEFORE INSERT OR UPDATE ON part_timers
FOR EACH ROW EXECUTE PROCEDURE not_full_timer();

CREATE OR REPLACE FUNCTION not_part_timer() RETURNS TRIGGER AS $trig$
DECLARE ctx NUMERIC;
BEGIN
SELECT COUNT(*) INTO ctx FROM part_timers PT
WHERE NEW.username = PT.username;
IF ctx > 0 THEN
RETURN NULL;
ELSE
RETURN NEW;
END IF; END; 
$trig$ LANGUAGE plpgsql;

CREATE TRIGGER check_full_timer
BEFORE INSERT OR UPDATE ON full_timers
FOR EACH ROW EXECUTE PROCEDURE not_part_timer();

CREATE OR REPLACE FUNCTION update_avg_rating() RETURNS trigger AS $ret$
 	DECLARE ctx NUMERIC;
    BEGIN
    SELECT COUNT(*) - 1 INTO ctx FROM bookings B
    WHERE NEW.caretaker = B.caretaker AND rating IS NOT NULL;
        IF NEW.rating IS NOT NULL THEN
        UPDATE caretakers 
 		SET average_rating = (average_rating * ctx + NEW.rating)/(ctx + 1)
        WHERE username = NEW.caretaker;
        RETURN NEW;
        ELSE
        RETURN NEW;
        END IF;
 	END;    
 $ret$ LANGUAGE plpgsql;

 CREATE TRIGGER update_rating
 	AFTER INSERT OR UPDATE ON bookings
 	FOR EACH ROW
 	EXECUTE PROCEDURE update_avg_rating();
     
>>>>>>> master
