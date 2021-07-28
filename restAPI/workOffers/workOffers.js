const express = require('express');
const router = express.Router();
const {authenticateContractorToken} = require('../../middleware')
const {getWorkOffersById ,getAllOffers, getWorkOffersByContractor, getWorkOffersByWorkOrder, createWorkOffer, updateWorkStatus}
  = require('../../DB/dbWorkOffers');


//Dev-Route get all work offers
router.get('/', async (req, res) => {
 const orders = await getAllOffers();
 res.json(orders);
})

// get one work offer by contractor ID
router.get('/contractor/:id', async (req, res) =>{
    const {id} = req.params;
    const client = await getWorkOffersByContractor(id);
    res.json(client);
    });


// get all of an orders workOffers
router.get('/:id', async (req, res) =>{
  const {id} = req.params;
  const client = await getWorkOffersByWorkOrder(id); // add filter by person
  res.json(client);
  });

  router.get('/byID/:id', async (req, res) =>{
    const {id} = req.params;
    const client = await getWorkOffersById(id); // add filter by person
    res.json(client);
    });

//create a workOffer
router.post('/', authenticateContractorToken, async (req, res) => {
  const payload = req.body;
  const { contractor } = req.user;
  payload.contractor_id = req.user.contractor
  const newOrder = await createWorkOffer(payload);

  res.json(newOrder);
})

//update work offer
router.put('/:id', async (req, res) => {
  const {id} = req.params;
  const {updatetype, data} = req.body;
  const ok = await updateWorkStatus(updatetype, data, id);

  // if(updatetype === 'lastLogin') return await updateClientLogin(res, id)
  res.json(ok)
})
//remove clien

module.exports = router;