require('dotenv').config();
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('./dbconfig');

const getAllContractors = async () => {
  try {
  const client = await pool.connect();
  const { rows } = await client.query('SELECT * FROM Contractors as c order by c.id');
  client.release();
  return rows;
} catch (err) {
  console.log('from get all contractors: '+err.message);
}
};

const getAllContractorsWithRating = async () => {
  try {
  const client = await pool.connect();
  const { rows } = await client.query(`
  SELECT * FROM Contractors as c
  RIGHT JOIN Rating as r
  on c.Contractor_id = r.Contractor_id
  order by r.rating`);
  client.release();
  return rows;
} catch (err) {
  console.log('from get all contractors with rating: '+err.message);
}
};

const getContractor = async (id) => {
  try {
  const client = await pool.connect();
  const { rows } = await client.query('SELECT * FROM Contractors as c WHERE c.contractor_id = $1', [id]);
  client.release();

  return rows;
}
catch(err) {
  console.log('get a contractor from db '+err.message);
}
};

const createContractor = async (payload) => {
  try {  const {
    username,
    orgnumber,
    companyname,
    password,
    fName,
    lName,
    email,
    phonenum,
    street,
    postalcode,
    city,
    profile_image
   } = payload;
  const contractor_id = uuid();

  const paylodData = [
    contractor_id,
    orgnumber,
    username,
    companyname,
    email,
    phonenum,
    street,
    postalcode,
    city,
    fName,
    lName,
    profile_image];

  const client = await pool.connect();
  const { rows: isTaken } = await client.query(`
  SELECT username FROM Contractors as c
  WHERE c.username = $1
  `, [username]);

  if (isTaken.length > 0) {
    client.release();
    return { message: 'Is taken', username }
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await client.query(`
  INSERT INTO Contractors
  (contractor_id, org_number, username, company_name, email, phone_num,street, postal_code, city, f_name, l_name, profile_image, password)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
  `, [...paylodData, hashedPassword]);
  client.release();
  return rows;}
  catch(err) {
    console.log('create a contractor: ');
    console.error(err)
  }
};

const loginContractor = async ({ password, username }) => {
  try {
  const client = await pool.connect();
  const { rows: isTaken } = await client.query(`
  SELECT username, company_name, password, contractor_id FROM contractors as c
  WHERE c.username = $1
  `, [username]);
  if (isTaken.length === 0) {
    client.release();
    return ({ message: 'No associated user' })
  }
  if (await bcrypt.compare(password, isTaken[0].password)) {
    const accessToken = jwt.sign({ contractor: isTaken[0].contractor_id, role: 'contractor' }, process.env.CONTRACTOR_CODE)
    const responseobj = { username: isTaken[0].company_name, role: 'contractor', accessToken };
    await client.query(`
    UPDATE contractors
    SET last_login = Now()
    WHERE contractor_id = $1
  `, [isTaken[0].contractor_id])
    client.release();
    return responseobj;
  }
  client.release();
  return ({ message: 'wrong password' })
} catch(err) {
  console.log('log in contractor '+err.message);
}
}

module.exports = {
  getAllContractors, getContractor, createContractor, loginContractor, getAllContractorsWithRating
}