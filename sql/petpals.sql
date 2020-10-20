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
    username varchar(64) references users(username) PRIMARY KEY
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
    price       numeric     NOT NULL check(price > getMinimumPrice(animal_name)),
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
    PRIMARY KEY(name, owner)
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
    delivery_type varchar(64) NOT NULL,
    status varchar(64) NOT NULL,
    bid_rate numeric NOT NULL,
    rating numeric check(rating >= 0 AND rating <= 5),
    remarks varchar(1000),
    FOREIGN KEY(owner, pet_name) references pets(owner, pet_name),
    PRIMARY KEY(owner, pet_name, caretaker, start_period, end_period)
);

