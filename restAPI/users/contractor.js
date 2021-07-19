const express = require('express');
const router = express.Router();
const { getAllContractors, getContractor, createContractor, loginContractor } = require('../../DB/dbContractor')

//get all contactors

router.get('/', async (req, res) =>{
const contactors = await getAllContractors();
res.json(contractors);
});

// get one contractor
router.get('/:id', async (req, res) =>{
    const {id} = req.params;
    const contractor = await getContractor(id);
    res.json(contractor);
    });

//create a contractor
router.post('/', async (req, res) => {
  const newContractor = await createContractor(req.body);
  res.json(newContractor);
})

//update contractor last login
router.put('/:id/:updatetype', async (req, res) => {
  const {id, updatetype} = req.params;
  // if(updatetype === 'lastLogin') return await updateContractorLogin(res, id)
  res.json('nok')
})
//remove contractor

//login contractor
router.post('/login', async (req,res) => {
  const loginAttempt = await loginContractor(req.body);
  res.json(loginAttempt)
})

module.exports = router;