const express = require('express');
const router = express.Router();
const {getAllOrders, getWorkOrder, getAllMyWorkOrders, createWorkOrder, updateWorkStatus, getAllOrderByContractorID}
  = require('../../DB/dbWorkOrders');
const { authenticateClientToken, authenticateContractorToken } = require('../../middleware')

//Dev-Route get all work orders
router.get('/', async (req, res) => {
 const orders = await getAllOrders();
 res.json(orders);
})

router.get('/contractor',authenticateContractorToken, async (req, res) => {
  const {contractor: id} = req.user
  const orders = await getAllOrderByContractorID(id);
  res.json(orders);
 })

// get all of a users workOrders
router.get('/user', authenticateClientToken, async (req, res) =>{
  const { client_id:id } = req.user;
  const client = await getAllMyWorkOrders(id);
  res.json(client);
});

// get one workOrder
router.get('/:id', async (req, res) =>{
    const {id} = req.params;
    const client = await getWorkOrder(id);
    res.json(client);
    });

//create a workOrder
router.post('/', authenticateClientToken, async (req, res) => {
  const { client_id } = req.user;
  const newOrder = await createWorkOrder(req.body, client_id);
  res.json(newOrder);
})

//update client last login
router.put('/:id', async (req, res) => {
    const {id} = req.params;
  const {updatetype, data} = req.body;
  const ok = await updateWorkStatus(updatetype, data, id);
  // if(updatetype === 'lastLogin') return await updateClientLogin(res, id)
  res.json(ok)
})
//remove clien

module.exports = router;