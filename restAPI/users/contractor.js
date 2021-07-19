const express = require('express');
const router = express.Router();
const { getAllContractors, getContractor, createContractor, updateContractorLogin } = require('../../DB/dbContractor')

//get all clients

router.get('/', async (req, res) =>{
const clients = await getAllContractors();
res.json(clients);
});

// get one client
router.get('/:id', async (req, res) =>{
    const {id} = req.params;
    const client = await getContractor(id);
    res.json(client);
    });

//create a client
router.post('/', async (req, res) => {
  const newClient = await createContractor(req.body);
  res.json(newClient);
})

//update client last login
router.put('/:id/:updatetype', async (req, res) => {
  const {id, updatetype} = req.params;
  if(updatetype === 'lastLogin') return await updateContractorLogin(res, id)
  res.json('nok')
})
//remove client


module.exports = router;