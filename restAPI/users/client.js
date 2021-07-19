const express = require('express');
const router = express.Router();
const { getAllClients, getClient, createClient,loginClient } = require('../../DB/dbClient')

//get all clients

router.get('/', async (req, res) =>{
const clients = await getAllClients();
res.json(clients);
});

// get one client
router.get('/:id', async (req, res) =>{
    const {id} = req.params;
    const client = await getClient(id);
    res.json(client);
    });

//create a client
router.post('/', async (req, res) => {
  const newClient = await createClient(req.body);
  res.json(newClient);
})

//update client last login
router.put('/:id/:updatetype', async (req, res) => {
  const {id, updatetype} = req.params;
  // if(updatetype === 'lastLogin') return await updateClientLogin(res, id)
  res.json('nok')
})
//remove client

//login client
router.post('/login', async (req,res) => {
  const loginAttempt = await loginClient(req.body);
  res.json(loginAttempt)
})


module.exports = router;