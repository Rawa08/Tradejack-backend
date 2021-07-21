require('dotenv').config();
const uuid = require('uuid').v4;
const pool = require('./dbconfig');

const getAllOffers = async () => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM workoffers as w order by w.ts');
    client.release();

    return rows;
  }
  catch (err) {
    console.log('getAllOffersfrom db ' + err.message)
  }
};

const getWorkOffersByContractor = async (id) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM workoffers as w WHERE w.contractor_id = $1', [id]);
    client.release();

    return rows;
  }
  catch (err) { console.log('get a wordorder from db ' + err.message) }
};

const getWorkOffersByWorkOrder = async (id) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM workoffers as w WHERE w.order_id = $1', [id]);
    client.release();

    return rows;
  } catch (err) { console.log('getting all my work offers ' + err.message) }
};

const createWorkOffer = async (payload) => {
  try {
    const { order_id,
      contractor_id,
      message_field
     } = payload;
    const payloadData = [order_id,
      contractor_id,
      message_field];

    const client = await pool.connect();
    const { rows } = await client.query(`
      INSERT INTO workoffers
      (order_id,
        contractor_id,
        message_field
       )
      VALUES ($1, $2, $3);
  `, payloadData);
    client.release();
    return rows;
  }
  catch (err) { console.log('From Create workoffer in db: ' + err.message) }
};

const updateWorkStatus = async (column, update_value, id) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`UPDATE workoffers as w SET ${column}=${update_value} WHERE w.id = $1`, [id]);
    client.release();

    return rows;
  } catch (err) { console.log('getting updateworkoffer ' + err.message) }
}

module.exports = {getAllOffers, getWorkOffersByContractor, getWorkOffersByWorkOrder, createWorkOffer, updateWorkStatus};