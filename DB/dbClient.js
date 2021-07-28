require('dotenv').config();
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./dbconfig');

const getAllClients = async () => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM clients as c order by c.id');
    client.release();

    return rows;
  }
  catch (err) {
    console.log('getAllClients from db ' + err.message)
  }
};

const getClient = async (id) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM clients as c WHERE c.client_id = $1', [id]);
    client.release();

    return rows;
  }
  catch (err) { console.log('get a client from db ' + err.message) }
};

const createClient = async (payload) => {
  try {
    const { username, f_name, l_name, email,
      password, phone_num, street, postal_code, city } = payload;
    const client_id = uuid();
    const payloadData = [client_id, username, f_name, l_name, email, phone_num, street, postal_code, city];

    const client = await pool.connect();
    const { rows: isTaken } = await client.query(`
  SELECT username FROM clients as c
  WHERE c.username = $1
  `, [username]);

    if (isTaken.length > 0) {
      client.release();
      return { message: 'Is taken', username }
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const { rows } = await client.query(`
  INSERT INTO clients
  (client_id, username, f_name, l_name, email, phone_num,street, postal_code, city, password)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
  `, [...payloadData, hashedPassword]);
    client.release();
    return rows;
  }
  catch (err) { console.log('From Create client in db: ' + err.message) }
};

const loginClient = async ({ password, username }) => {
  try {
    const client = await pool.connect();
    const { rows: isTaken } = await client.query(`
  SELECT username, password, client_id FROM clients as c
  WHERE c.username = $1
  `, [username]);
    if (isTaken.length === 0) {
      client.release();
      return ({ message: 'No associated user' })
    }
    if (await bcrypt.compare(password, isTaken[0].password)) {
      const accessToken = jwt.sign({ client_id: isTaken[0].client_id, role: 'client' }, process.env.CLIENT_CODE)
      const responseobj = { username:isTaken[0].username,role: 'client', accessToken };
      await client.query(`
    UPDATE clients
    SET last_login = Now()
    WHERE client_id = $1
  `, [isTaken[0].client_id])
      client.release();
      return responseobj;
    }
    client.release();
    return ({ message: 'wrong password' })
  }
  catch (err) { console.log('Log in client ' + err.message) }
};

module.exports = {
  getAllClients, getClient, createClient, loginClient
};
