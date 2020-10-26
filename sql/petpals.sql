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

CREATE TABLE handles (
    caretaker   varchar(64) references caretakers(username),
    animal_name varchar(64) references pet_types(animal_name),
    price       numeric     NOT NULL check(price > 0),
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

CREATE TABLE bookings (
    owner varchar(64),
    pet_name varchar(64),
    caretaker varchar(64) references caretakers(username),
    start_period date, 
    end_period date,
    payment_method varchar(64) NOT NULL,
    delivery_method varchar(64) NOT NULL,
    status varchar(64) NOT NULL,
    bid_rate numeric NOT NULL,
    rating numeric check(rating >= 0 AND rating <= 5),
    remarks varchar(1000),
    FOREIGN KEY(owner, pet_name) references pets(owner, pet_name),
    PRIMARY KEY(owner, pet_name, caretaker, start_period, end_period)
);

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
     
CREATE OR REPLACE FUNCTION insert_leave_full_timer() RETURNS trigger AS $$
    BEGIN
        IF NEW.username IN (SELECT username FROM full_timers) AND 
            (SELECT COUNT(*) FROM bookings WHERE NEW.username = bookings.caretaker AND status = 'ACCEPTED') > 0
            RETURN NULL;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;
    
CREATE TRIGGER check_insert_leave_full_timer
    AFTER INSERT ON leave_dates
    FOR EACH ROW
    EXECUTE PROCEDURE insert_leave_full_timer();


CREATE OR REPLACE FUNCTION check_insert_leave_full_timer() RETURNS trigger AS $ret$
    DECLARE num1 NUMERIC;
    BEGIN
        SELECT COUNT(*) INTO num1 
        FROM bookings 
        WHERE EXISTS (SELECT 1 FROM full_timers WHERE NEW.username = full_timers.username) 
            AND NEW.username = bookings.caretaker 
            AND status = 'ACCEPTED' 
            AND date(NEW.start_period) >= date(bookings.start_period) 
            AND date(NEW.end_period) <= date(bookings.end_period);
        IF (num1 > 0) THEN
            RETURN NULL;
        ELSE
            RETURN NEW;
        END IF;
    END;
$ret$ LANGUAGE plpgsql;

CREATE TRIGGER insert_leave_full_timer
    AFTER INSERT OR UPDATE ON leave_dates
    FOR EACH ROW
    EXECUTE PROCEDURE check_insert_leave_full_timer();