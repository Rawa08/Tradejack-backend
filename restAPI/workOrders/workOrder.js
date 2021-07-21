const express = require('express');
const router = express.Router();
const {getAllOrders, getWorkOrder, getAllMyWorkOrders, createWorkOrder, updateWorkStatus}
  = require('../../DB/dbWorkOrders');

//Dev-Route get all work orders
router.get('/', async (req, res) => {
 const orders = await getAllOrders();
 res.json(orders);
})

// get one workOrder
router.get('/:id', async (req, res) =>{
    const {id} = req.params;
    const client = await getWorkOrder(id);
    res.json(client);
    });

// get all of a users workOrders
router.get('/user/:id', async (req, res) =>{
  const {id} = req.params;
  const client = await getAllMyWorkOrders(id);
  res.json(client);
  });

//create a workOrder
router.post('/', async (req, res) => {
  const newOrder = await createWorkOrder(req.body);
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