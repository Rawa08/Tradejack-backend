const express = require('express');
const router = express.Router();
const { getAllClients, getClient, createClient,loginClient } = require('../../DB/dbClient');
const { authenticateClientToken } = require('../../middleware');


//get all clients

router.get('/', async (req, res) =>{
const clients = await getAllClients();
res.json(clients);
});

// get one client
router.get('/profile', authenticateClientToken, async (req, res) =>{
    const {client_id: id} = req.user;
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
  console.log(req.body);
  const loginAttempt = await loginClient(req.body);
  res.json(loginAttempt)
})

module.exports = router;