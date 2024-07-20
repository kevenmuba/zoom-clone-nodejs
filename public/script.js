const socket = io('https://zoom-clone-nodejs.onrender.com/');
//const socket = io('http://localhost:3000');

//const socket = io('/');// step 3
// step 4
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3000',
}); // undefine yaregnew manm mehon slemichl new any room id lemareg new rasu peer server detect endiyaregew
const peers = {}
// step 2 creating video 
const videoGrid = document.getElementById('video-grid');
let  myVideoStream;
const myVideo = document.createElement('video');// it creates like <video></video>
myVideo.muted = true;// this sound become silent to me but listen for others
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    console.log('Stream received:', stream);
    myVideoStream = stream;// the video and audio
    addVideoStream(myVideo,stream)// upto here is video stream
    socket.on('user-connected',userId=>{
      console.log("New user connected...")
      //connectToNewUser(userId, stream)
      setTimeout(connectToNewUser,1000,userId,stream)
  });
  // second person video

  myPeer.on('call', (call) => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    console.log('it is answering')
  },function(err) {
    console.log('Failed to get local stream' ,err);
  });


    
  }).catch((err) => {
    console.error('Failed to get local stream', err);
  })

  //socket.emit('join-room',roomId)
  /*socket.on('user-connected', (userId) => {
    connectToNewUser(userId,stream);
  });*/

  myPeer.on('open', (id) => {
   socket.emit('join-room',roomId , id);
   //console.log('the id tracked by peer server is ',id)
  });

  socket.on('user-disconnected', (userId) => {
    if (peers[userId]){
      peers[userId].close();

    } 
  });

  // input value
  
  let text = document.querySelector('#chat_message');
  console.log(document.querySelector('html'));
  document.querySelector('html').addEventListener('keydown', function (e) {
    if (e.which == 13 && text.value.length !== 0) {
      socket.emit('message', text.value);
      text.value = '';
    }
  });
  socket.on('createMessage', (message) => {
    $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom();
  });




socket.on('createMessage', (message) => {
  $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
  scrollToBottom();
});
    
   

  function connectToNewUser(userId,stream) {
    
    console.log('the user id tracked by the peer server is ',userId)
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream);// it mean it add my video to others and other video to me
      console.log('it is calling')
    })
   
    call.on('close', () => {
      video.remove();
    });
  
  peers[userId] = call;// so eyandandun user id track  aregn so exit siyareg yachi array object bcha twetalech
    
    
  }
  
  function addVideoStream(video, stream) {
    video.srcObject = stream;// srcObject is  like src for img
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    videoGrid.append(video);// it appends(adds) the video to the video grid div
  }

  const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  };

  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `;
    document.querySelector('.main__mute_button').innerHTML = html;
  };
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `;
    document.querySelector('.main__mute_button').innerHTML = html;
  };
  const playStop = () => {
    console.log('object');
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo();
    } else {
      setStopVideo();
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  };

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `;
    document.querySelector('.main__video_button').innerHTML = html;
  };
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `;
    document.querySelector('.main__video_button').innerHTML = html;
  };






  
 
  
 
 
  
  
  


 
    