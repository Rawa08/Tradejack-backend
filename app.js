const express = require('express');
const app = express();
const cors = require('cors');
const manageUserRoute = require('./restAPI/index');
const PORT = process.env.PORT || 3000;

app.use(express.json({limit: '20MB'}));
app.use(cors())

app.use('/api',manageUserRoute)



app.listen(PORT, () => console.log(`bzt.. bzt... flying on ${PORT}`));