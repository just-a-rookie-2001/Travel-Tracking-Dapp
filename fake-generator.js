const { faker } = require("@faker-js/faker");
const { nanoid } = require("nanoid");
const countries = require("./src/data/countries.json");

const createUsers = () => {
  const fakerUsers = [];
  for (let i = 0; i <= 100000; i++) {
    let dob = faker.date.birthdate({
      min: 18,
      max: 60,
    });
    const yyyy = dob.getFullYear();
    let mm = dob.getMonth() + 1;
    let dd = dob.getDate();
    dob = dd + "/" + mm + "/" + yyyy;
    fakerUsers.push({
      id: faker.datatype.uuid(),
      passport_number: nanoid(10),
      name: faker.name.findName(),
      dob,
      nationality: countries[Math.floor(Math.random() * countries.length)].name,
    });
  }
  return fakerUsers;
};

const airlines = [
  "Air India",
  "SpiceJet",
  "AirAsia India",
  "Alliance Air",
  "TruJet",
  "Air Transat",
  "Delta Air Lines",
];

const planeModels = [
  "Airbus A350 XWB",
  "Antonov An-148/An-158",
  "Airbus A330",
  "Boeing 777",
  "Comac C919",
  "Boeing 747",
  "Ilyushin Il-96",
  "Mitsubishi SpaceJet",
  "McDonnell Douglas DC-9",
];

const notSame = (country) => {
  const temp = countries[Math.floor(Math.random() * countries.length)].name;
  if (temp !== country) {
    return temp;
  } else {
    notSame(country);
  }
};

const createFlights = () => {
  let fakeFlights = [];
  for (let i = 0; i <= 10000; i++) {
    const flight_id = nanoid(6);
    const code =
      countries[Math.floor(Math.random() * countries.length)].code +
      faker.datatype.number({
        min: 1000,
        max: 9999,
      });
    const flight_name = planeModels[Math.floor(Math.random() * planeModels.length)];
    const operator = airlines[Math.floor(Math.random() * airlines.length)];
    const departure_airport_country = countries[Math.floor(Math.random() * countries.length)].name;
    const arrival_airport_country = notSame(departure_airport_country);
    fakeFlights.push({
      flight_id,
      code,
      flight_name,
      operator,
      departure_airport_country,
      arrival_airport_country,
    });
  }
  return fakeFlights;
};

console.log(createUsers())
console.log(createFlights())

module.exports = {
  createUsers,
  createFlights,
};