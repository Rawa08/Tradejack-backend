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


const getWorkOffersById = async (id) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM workoffers as w WHERE w.id = $1', [id]);
    client.release();

    return rows;
  }
  catch (err) { console.log('get a wordorder from db by id' + err.message) }
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
    console.log(id)
    const client = await pool.connect();
    // const { rows } = await client.query(`SELECT c.*, w.*, r.* FROM workoffers as w
    //    INNER JOIN Contractors as c ON w.Contractor_id = c.Contractor_id
    //    LEFT JOIN rating as r ON w.Contractor_id = r.contractor_id  WHERE w.order_id = $1
    //    `, [id]);
    const { rows } = await client.query(`SELECT c.*, w.* FROM workoffers as w
    INNER JOIN Contractors as c ON w.Contractor_id = c.Contractor_id WHERE w.order_id = $1
    `, [id]);

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
    const offers = await client.query(`SELECT w.* FROM workoffers as w WHERE w.order_id=$1 AND
    w.contractor_id=$2
    `, [order_id, contractor_id]);

    if (offers.rows.length > 0) {
      client.release();
      return 'Contractor have alredy an offer on this order!'
    } else {
      const { rows } = await client.query(`
      INSERT INTO workoffers
      (order_id,
        contractor_id,
        message_field
       )
      VALUES ($1, $2, $3);
  `, payloadData);
      client.release();
      return rows
    }




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

module.exports = { getWorkOffersById, getAllOffers, getWorkOffersByContractor, getWorkOffersByWorkOrder, createWorkOffer, updateWorkStatus };