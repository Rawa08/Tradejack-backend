const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
const cors = require('cors');
const { clientRoutes, contractorRoutes, workOrderRoutes, workOfferRoutes, contractorRating } = require('./restAPI/index');
const PORT = process.env.PORT || 3000;
const cloudinary = require('cloudinary');

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001']
  }
})

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SEC
});

app.use(express.json({ limit: '20MB' }));
app.use(cors());

app.post('/api/work/workorders/uploadimage', async (req, res) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(req.body.data, {
      public_id: `${Math.random().toString(16).substr(2, 10)}`
    })
    console.log(uploadedResponse.secure_url)
    res.json(uploadedResponse.secure_url)
  } catch (error) {
    console.log(error.message)
    res.send(error.message)
  }
})

const chatList = [];
const chats = [];

io.on("connection", socket => {
  socket.on('join', info => {
    socket.join(info.room);
    const index = chatList.findIndex(cL => cL.room === info.room);
    if (index === -1) {
      chatList.push(info);
    }
  });

  socket.on('fetchChats', username => {
    const prevChats = chatList.filter(cL => cL.username === username);
    io.to(socket.id).emit('sendChatList', prevChats);
  })

  socket.on('fetchOld', info => {
    const pastMessages = chats.filter(chat => chat.room === info)
    console.log(pastMessages, info);
    io.to(socket.id).emit('bulkMessages', pastMessages);
  })

  socket.on('newMessage', body => {
    const data = { ...body, tStamp: Date.now(), sender: body.username }
    chats.push(data);
    io.to(body.room).emit('message', data);
  });

  socket.on('disconnect', () => {
  });
})


app.use('/api/users/clients', clientRoutes);
app.use('/api/users/contractors', contractorRoutes);
app.use('/api/work/workorders', workOrderRoutes);
app.use('/api/work/workoffers', workOfferRoutes);
app.use('/api/work/rating', contractorRating);


server.listen(PORT, () => console.log(`bzt.. bzt... flying on ${PORT}`));