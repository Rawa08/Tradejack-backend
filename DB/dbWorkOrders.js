require('dotenv').config();
const uuid = require('uuid').v4;
const pool = require('./dbconfig');

const getAllOrders = async () => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM workorders as w order by w.ts');
    client.release();

    return rows;
  }
  catch (err) {
    console.log('getAllOrdersfrom db ' + err.message)
  }
};

const getWorkOrder = async (id) => {
  try {
    console.log(id)
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM workorders as w WHERE w.id = $1', [id]);
    client.release();

    return rows;
  }
  catch (err) { console.log('get a wordorder from db ' + err.message) }
};

const getAllMyWorkOrders = async (id) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM workorders as w WHERE w.author_id = $1', [id]);
    client.release();

    return rows;
  } catch (err) { console.log('getting all my work orders ' + err.message) }
};

const createWorkOrder = async (payload, author_id) => {
  try {
    const {
      title,
      description,
      street,
      postal_code,
      city,
      start_date,
      end_date,
      image_link } = payload;
    const payloadData = [author_id,
      title,
      description,
      street,
      postal_code,
      city,
      start_date,
      end_date,
      image_link];

    const client = await pool.connect();
    const { rows } = await client.query(`
      INSERT INTO workorders
      (author_id,
       title,
       description,
       street,
       postal_code,
        city,
        start_date,
        end_date,
       image_link)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
  `, payloadData);
    client.release();
    return rows;
  }
  catch (err) { console.log('From Create workOrder in db: ' + err.message) }
};

const updateWorkStatus = async (column, update_value, id) => {
  try {
      console.log(column+'  '+update_value+'  '+id)
    const client = await pool.connect();
    const { rows } = await client.query(`UPDATE workorders as w SET ${column}=${update_value} WHERE w.id = $1`, [id]);
    client.release();

    return rows;
  } catch (err) { console.log('getting updateWorkorder ' + err.message) }
}

module.exports = {
  getAllOrders, getWorkOrder, getAllMyWorkOrders, createWorkOrder, updateWorkStatus
};