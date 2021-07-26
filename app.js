const express = require('express');
const app = express();
const cors = require('cors');
const {clientRoutes, contractorRoutes, workOrderRoutes, workOfferRoutes, contractorRating}= require('./restAPI/index');
const PORT = process.env.PORT || 3000;
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SEC
});

app.use(express.json({limit: '20MB'}));
app.use(cors());

app.post('/api/work/workorders/uploadimage', async (req, res) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(req.body.data, {
      public_id: `${Math.random().toString(16).substr(2,10)}`
    })
    console.log(uploadedResponse.secure_url)
    res.json(uploadedResponse.secure_url)
  } catch (error) {
    console.log(error.message)
    res.send(error.message)
  }

})


app.use('/api/users/clients',clientRoutes);
app.use('/api/users/contractors', contractorRoutes);
app.use('/api/work/workorders', workOrderRoutes);
app.use('/api/work/workoffers', workOfferRoutes);
app.use('/api/work/rating', contractorRating);


app.listen(PORT, () => console.log(`bzt.. bzt... flying on ${PORT}`));