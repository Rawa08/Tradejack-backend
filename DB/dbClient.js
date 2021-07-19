const uuid = require('uuid').v4;
const bcrypt = require('bcrypt')
const pool = require('./dbconfig');

const getAllClients = async () => {
  const client = await pool.connect();
  const { rows } = await client.query('SELECT * FROM clients as c order by c.id');
  client.release();

  return rows;
};

const getClient = async (id) => {
  const client = await pool.connect();
  const { rows } = await client.query('SELECT * FROM clients as c WHERE c.client_id = $1', [id]);
  client.release();

  return rows;
};

const createClient = async (payload) => {
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
    return { message: 'Is taken', username }
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  payloadData.push(hashedPassword);
  const { rows } = await client.query(`
  INSERT INTO clients
  (client_id, username, f_name, l_name, email, phone_num,street, postal_code, city, password)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
  `, payloadData);
  client.release();
  return rows;
};

const loginClient = async ({password, username}) => {
  const client = await pool.connect();
  const { rows: isTaken } = await client.query(`
  SELECT username, password FROM clients as c
  WHERE c.username = $1
  `, [username]);
  if (isTaken.length === 0) {
    return { message: 'No associated user' }
  }

}

const updateClientLogin = async (res, id) => {
  const client = await pool.connect();
  const { rows } = await client.query(`
  UPDATE clients
  SET last_login = Now()
  WHERE client_id = $1
  `, [id]);
  client.release();
  return res.json(rows)
}

module.exports = {
  getAllClients, getClient, createClient, updateClientLogin
}
