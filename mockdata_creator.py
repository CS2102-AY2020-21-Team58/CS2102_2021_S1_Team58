import random

users = []
caretakers = []
owners = []
pets = []

onwer_pet = {}

locations = ['East', 'West', 'South', "North"]

add_user_f = "INSERT INTO users (username, password, first_name, location, card_number) VALUES('{}', '{}', '{}', '{}', {});\n"
add_owner = "INSERT INTO owners(username) VALUES('{}');\n"
add_caretaker = "INSERT INTO caretakers(username) VALUES('{}');\n"
add_part = "INSERT INTO part_timers(username) VALUES('{}');\n"
add_full = "INSERT INTO full_timers(username) VALUES('{}');\n"
add_admin = "INSERT INTO administrator (username) VALUES('{}');\n"

passwordf = "password{}"
caretakerf = "caretaker{}"
ownerf = "owner{}"

# open SQL file
f = open("mockdata.sql", "w")

# Add admins
f.write(add_user_f.format("Abhiman", "pass1", "Abhiman", "East", 1234567887654321))
f.write(add_admin.format("Abhiman"))
f.write(add_user_f.format("Aakanksha", "pass2", "Aakanksha", "West", 1234567887654321))
f.write(add_admin.format("Aakanksha"))
f.write(add_user_f.format("Joshua", "pass3", "Joshua", "South", 1234567887654321))
f.write(add_admin.format("Joshua"))
f.write(add_user_f.format("Abdul", "pass4", "Abdul", "North", 1234567887654321))
f.write(add_admin.format("Abdul"))
f.write(add_user_f.format("Wei Yang", "pass5", "Wei Yang", "West", 1234567887654321))
f.write(add_admin.format("Wei Yang"))

# Add owners
for i in range(0, 20):
    username = ownerf.format(i)
    password = passwordf.format(i)
    location = locations[random.randint(0, 3)]
    cardnumber = 9999999999999999 - random.randint(999999, 99999999)
    
    query = add_user_f.format(username, password, username, location, cardnumber)
    f.write(query)
    f.write(add_owner.format(username))
    
    owners.append(username)

# Add caretakers
for i in range(0, 20):
    username = caretakerf.format(i)
    password = passwordf.format(i)
    location = locations[random.randint(0, 3)]
    cardnumber = 9999999999999999 - random.randint(999999, 99999999)
    
    query = add_user_f.format(username, password, username, location, cardnumber)
    f.write(query)
    f.write(add_caretaker.format(username))

    caretakers.append(username)

    if(random.randint(0, 1) == 0):
        f.write(add_full.format(username))
    else:
        f.write(add_part.format(username))

# Add pet types
pet_types = ['Dog', 'Cat', 'Big Dog', 'Lizard']

f.write("INSERT INTO pet_types (animal_name, base_price) VALUES('Dog', 25);\n")
f.write("INSERT INTO pet_types (animal_name, base_price) VALUES('Cat', 15);\n")
f.write("INSERT INTO pet_types (animal_name, base_price) VALUES('Big Dog', 10);\n")
f.write("INSERT INTO pet_types (animal_name, base_price) VALUES('Lizard', 12);\n")

# Add caretaker handling

add_handles = "INSERT INTO handles (caretaker, animal_name, price) VALUES ('{}', '{}', '{}');\n"

caretaker_animal = {}

for c in caretakers:
        s_start = random.randint(0, 4)
        s_end = random.randint(4-s_start, 4)

        caretaker_animal[c] = []

        for i in range(s_start, s_end):
            s = pet_types[i]
            caretaker_animal[c].append(s)
            price = random.randint(30, 40)
            f.write(add_handles.format(c, s, price))

# Add pets
add_pet = "INSERT INTO pets (pet_name, type, owner) VALUES('{}', '{}', '{}');\n"

petid = 0
for o in owners:
    petnum = random.randint(1, 3)

    onwer_pet[o] = []

    for i in range(0, petnum):
        pettype = pet_types[random.randint(0, 3)]
        petname = pettype + str(petid)
        pets.append(petname)
        petid += 1
        onwer_pet[o].append(petname)
        f.write(add_pet.format(petname, pettype, o))

# Add pets services

services = ['Bathe', 'Give pills', 'Take on walk', 'Feed']

f.write("INSERT INTO services (service_name) VALUES('Bathe');\n")
f.write("INSERT INTO services (service_name) VALUES('Take on walk');\n")
f.write("INSERT INTO services (service_name) VALUES('Feed');\n")
f.write("INSERT INTO services (service_name) VALUES('Give pills');\n")

insert_petservice = "INSERT INTO requires (owner, pet_name, service_name) VALUES ('{}', '{}', '{}');\n"

for o in onwer_pet.keys():
    animals = onwer_pet[o]
    for p in animals:
        s_start = random.randint(0, 3)
        s_end = random.randint(3-s_start, 3)

        for i in range(s_start, s_end):
            s = services[i]
            f.write(insert_petservice.format(o, p, s))

caretaker_provides = "INSERT INTO provides (caretaker, animal_name, service_name) VALUES ('{}', '{}', '{}');\n"

# Add services provided by caretaker

for c in caretaker_animal:
    animals = caretaker_animal[c]

    for a in animals:
        s_start = random.randint(0, 3)
        s_end = random.randint(3-s_start, 3)

        for i in range(s_start, s_end):
            s = services[i]
            f.write(caretaker_provides.format(c, a, s))





