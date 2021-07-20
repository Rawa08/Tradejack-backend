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
  console.log('get all contractors '+err.message);
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
    org_number,
    username,
    company_name,
    email,
    password,
    phone_num,
    street,
    postal_code,
    city,
    f_name,
    l_name } = payload;
  const contractor_id = uuid();

  const paylodData = [
    contractor_id,
    org_number,
    username,
    company_name,
    email,
    phone_num,
    street,
    postal_code,
    city,
    f_name,
    l_name];

  const client = await pool.connect();
  const { rows: isTaken } = await client.query(`
  SELECT username FROM Contractors as c
  WHERE c.username = $1
  `, [username]);

  if (isTaken.length > 0) {
    return { message: 'Is taken', username }
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await client.query(`
  INSERT INTO Contractors
  (contractor_id, org_number, username, company_name, email, phone_num,street, postal_code, city, f_name, l_name, password)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
  `, [...paylodData, hashedPassword]);
  client.release();
  return rows;}
  catch(err) {
    console.log('create a contractor '+err.message);
  }
};

const loginContractor = async ({ password, username }) => {
  try {
  const client = await pool.connect();
  const { rows: isTaken } = await client.query(`
  SELECT username, password, contractor_id FROM contractors as c
  WHERE c.username = $1
  `, [username]);
  if (isTaken.length === 0) {
    return ({ message: 'No associated user' })
  }
  if (await bcrypt.compare(password, isTaken[0].password)) {
    const accessToken = jwt.sign({ contractor: isTaken[0].contractor_id, role: 'contractor' }, 'process.env.ACCESS_CODE')
    const responseobj = { role: 'contractor', accessToken };
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
  getAllContractors, getContractor, createContractor, loginContractor
}