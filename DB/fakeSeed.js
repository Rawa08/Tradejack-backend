const faker = require('faker/locale/sv')
const axios = require('axios')

const createContractor = async () => {
  for(let i=0; i<20; i++) {
    const contractor = {
      "orgnumber": faker.finance.account(10),
      username: faker.internet.userName(),
      companyname: faker.company.companyName(0),
      "fname": faker.name.firstName(),
      "lname": faker.name.lastName(),
      email: faker.internet.exampleEmail(),
      password: 'test',
      "phonenum": faker.phone.phoneNumber(0),
      street: faker.address.streetName(),
      "postalcode": faker.address.zipCode(),
      city: faker.address.cityName(),
    };
    await axios.post('http://localhost:3000/api/users/contractors', contractor);
  }
}


  const clientSchema = {
    "username": "Tottzi",
    "f_name": "Adam",
    "l_name": "Cs",
    "email": "tottzi@gmail.com",
    "password": "testingpastestingpastestingpastestingpastestingpastestingpas",
    "phone_num": "0123456785",
    "street": "sillystreet",
    "postal_code": 1360,
    "city": "Oslo"
    }

const createClient = async () => {
  for(let i=0; i<50; i++) {
    const client = {
      username: faker.internet.userName(),
      "f_name": faker.name.firstName(),
      "l_name": faker.name.lastName(),
      email: faker.internet.exampleEmail(),
      password: 'test',
      "phone_num": faker.phone.phoneNumber(0),
      street: faker.address.streetName(),
      "postal_code": faker.address.zipCode(),
      city: faker.address.cityName(),
    }
    await axios.post('http://localhost:3000/api/users/clients', client)
  }
}

createClient();
createContractor();
