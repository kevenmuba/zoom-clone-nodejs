// step 1
const  express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.set('view engine','ejs')// step 1 
app.use(express.static('public'))// step1  ke public filachin static tetekem eyalnew new
app.use('/peerjs', peerServer);//we are connecting peer server
 
 
// step1
app.get('/', (req, res) => {  
  res.redirect(`/${uuidV4()}`)
})
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})// room yemilew / blo yemimetaw uuid new

// step3
io.on('connection',(socket) => {
  socket.on('join-room',(roomId,userId)=> {
    console.log('the link that the main room is ',roomId)
    console.log('the id tracked by the peer is ',userId)
   socket.join(roomId)// be room id join yadrgu eyalk new le serveru 
   socket.to(roomId).broadcast.emit('user-connected',userId);

   // messages
   socket.on('message', (message) => {
    //send message to the same room
    io.to(roomId).emit('createMessage', message)
}); 


   socket.on('disconnect', () => {
    socket.to(roomId).broadcast.emit('user-disconnected', userId)
  })

  })
})






server.listen(process.env.PORT || 3000);
