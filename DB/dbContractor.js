const uuid = require('uuid').v4;
const pool = require('./dbconfig');

const getAllContractors = async () => {
  const client = await pool.connect();
  const { rows } = await client.query('SELECT * FROM Contractors as c order by c.id');
  client.release();

  return rows;
};

const getContractor = async (id) => {
  const client = await pool.connect();
  const { rows } = await client.query('SELECT * FROM Contractors as c WHERE c.contractor_id = $1', [id]);
  client.release();

  return rows;
};

const createContractor = async (payload) => {
  const {
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
    password,
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

  const { rows } = await client.query(`
  INSERT INTO Contractors
  (contractor_id, org_number, username, company_name, email, password, phone_num,street, postal_code, city, f_name, l_name)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
  `, paylodData);
  client.release();
  return rows;
};

const updateContractorLogin = async (res, id) => {
  const client = await pool.connect();
  const { rows } = await client.query(`
  UPDATE Contractors
  SET last_login = Now()
  WHERE Contractor_id = $1
  `, [id]);
  client.release();
  return res.json(rows)
}

module.exports = {
  getAllContractors, getContractor, createContractor, updateContractorLogin
}