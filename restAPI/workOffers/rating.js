const express = require('express');
const router = express.Router();

const { getAllRatings, getContractorRating,
    getContractorAverageRating, getContractorReviews,
    createRating } = require('../../DB/Rating');


//Rawa testing
router.get('/', async (req, res) => {
    const contractorRatings = await getAllRatings();
    res.json(contractorRatings);
});



router.get('/:id', async (req, res) => {
    const contractorRatings = await getContractorRating(req.params.id);

    res.json(contractorRatings);
});

router.get('/average/:id', async (req, res) => {
    const contractorRatings = await getContractorAverageRating(req.params.id);

    res.json({rating:parseInt(contractorRatings)});
});

router.get('/reviews/:id', async (req, res) => {
    const contractorRatings = await getContractorReviews(req.params.id);

    res.json(contractorRatings);
});


router.post('/', async (req, res) => {
    const {contractor_id, workorder_id, client_id, rating, review} = req.body;
    console.log('new rating: ' + contractor_id, workorder_id, client_id, rating)
    if(!contractor_id || !workorder_id || !client_id || !rating){

        res.json('Please Provide contractor_id, workorder_id(INT), client_id, rating(INT)')
    }

    else {const rating = await createRating(req.body)

    res.json(rating)}

})
module.exports = router;