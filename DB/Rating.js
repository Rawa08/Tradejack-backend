require('dotenv').config();
const pool = require('./dbconfig');

//Only Dev-  Get all Ratings from DB
const getAllRatings = async () => {
    try {
        const client = await pool.connect();
        const { rows } = await client.query('SELECT * FROM Rating as r order by r.ts');
        client.release();
        return rows;
    }
    catch (err) {
        console.log('getAllRatings from db ' + err.message)
    }
};

//Get Contractors all ratings by contractors id
const getContractorRating = async (id) => {

    try {
        const client = await pool.connect();
        const { rows } = await client.query('SELECT * FROM Rating as r WHERE r.contractor_id = $1 ', [id]);
        client.release();

        return rows;
    }
    catch (err) {
        console.log('getContractorRating from db ' + err.message)
    }
};

//Get avrage rating float by contractors id
const getContractorAverageRating = async (id) => {

    try {
        const client = await pool.connect();
        const { rows } = await client.query('SELECT r.rating FROM Rating as r WHERE r.contractor_id = $1 ', [id]);

        const allRatings = [];
        const ratings = await rows.map(d => allRatings.push(d.rating))
        const averageRating = allRatings.reduce((acc, curr) => (acc + curr)) / allRatings.length;
        client.release();

        return averageRating.toFixed(1);
    }
    catch (err) {
        console.log('getContractorAverageRating from db ' + err.message)
    }
};

//Get each review and rating by contractors id
const getContractorReviews = async (id) => {

    try {
        const client = await pool.connect();
        const { rows } = await client.query('SELECT r.rating, r.review FROM Rating as r WHERE r.contractor_id = $1 ', [id]);
        client.release();

        return rows;
    }
    catch (err) {
        console.log('getContractorReviews  from db ' + err.message)
    }
};

//Create Rating and review
const createRating = async (payload) => {

    try {

        const db = await pool.connect();
        const { contractor_id, workorder_id, client_id, rating, review } = payload;
        const {rows} = await db.query(`
        SELECT * FROM rating as r
        WHERE r.workorder_id = $1
        `, [workorder_id]);

        if(rows.length > 0 ) return 'You can only rate contractor one time';

        const workOffer = await db.query(`SELECT * FROM workoffers as w WHERE w.contractor_id = $1 AND w.order_id = $2
    `, [contractor_id, workorder_id]);


        let offer = {};
        workOffer.rows.map(offers => {
            if (!offers.chosen) return 'Contractors offer must  be chosen before rating';
            else return offer = { ...offers }
        });


        const workOrder = await db.query(` SELECT * FROM Workorders
    WHERE workorders.author_id = $1 AND id = $2
    `, [client_id, offer.order_id]);

        if (workOrder.rows.length <1  || workOrder.rows[0].author_id !== client_id) {

            return 'Please Rate a Order made by You';
        }
        else {

            const saveRating = await db.query(`
          INSERT INTO Rating (contractor_id, workorder_id, client_id, rating, review)
          VALUES ($1, $2, $3, $4, $5);`,
                [contractor_id, workorder_id, client_id, rating, review]);
            db.release();
            return saveRating.rows;
        }

    }
    catch (err) { console.log('From createRating: ' + err.message) }
};

module.exports = {
    getAllRatings, getContractorRating, getContractorAverageRating, getContractorReviews, createRating
}
