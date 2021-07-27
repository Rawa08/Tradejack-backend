require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateClientToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.json('you must be logged in to do this');
  jwt.verify(token, process.env.CLIENT_CODE, (err, user) => {
    if(err) return res.json('Log in again, something went wrong');
    req.user = user
    next();
  })
}

const authenticateContractorToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.json('you must be logged in to do this');
  jwt.verify(token, process.env.CONTRACTOR_CODE, (err, user) => {
    if(err) return res.json('Log in again, something went wrong');
    req.user = user
    next();
  })
}

module.exports = { authenticateClientToken, authenticateContractorToken }
