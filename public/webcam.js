const socket = io("/");// สร้างตัวแปร มาเก็บค่า ที่เรียกใช้ function io
const videoGrid = document.getElementById("video-grid");//สร้างตัวแปร มาเก็บค่า ที่เรียกใช้ คำสั่งเข้าถึง element ID video-grid
const myVideo = document.createElement("video");// สร้างตัวแปร มาเก็บค่า ที่เรียกใช้ คำสั่งสร้าง element ชื่อ video
const showChat = document.querySelector("#showChat");//สร้างตัวแปร มาเก็บค่า ที่เรียกใช้ คำสั่งเข้าถึง element id:showChat
const backBtn = document.querySelector(".header__back");//สร้างตัวแปร มาเก็บค่า ที่เรียกใช้ คำสั่งเข้าถึง element class:showChat
myVideo.muted = true;

backBtn.addEventListener("click", () => { // function  แสดงข้อมูลฝั่งซ้าย
  document.querySelector(".main__left").style.display = "flex";//เรียกใช้ คำสั่งเข้าถึง element class:main__left
  document.querySelector(".main__left").style.flex = "1";//เรียกใช้ คำสั่งเข้าถึง element class:main__left
  document.querySelector(".main__right").style.display = "none";//เรียกใช้ คำสั่งเข้าถึง element class:main__right
  document.querySelector(".header__back").style.display = "none";//เรียกใช้ คำสั่งเข้าถึง element class:header__back
});

showChat.addEventListener("click", () => { //function แสดงข้อมูลการแชท ฝั่งขวา
  document.querySelector(".main__right").style.display = "flex";//เรียกใช้ คำสั่งเข้าถึง element class:main__right
  document.querySelector(".main__right").style.flex = "1";//เรียกใช้ คำสั่งเข้าถึง element class:main__right
  document.querySelector(".main__left").style.display = "none";//เรียกใช้ คำสั่งเข้าถึง element class:main__left
  document.querySelector(".header__back").style.display = "block";//เรียกใช้ คำสั่งเข้าถึง element class:header__back
});

const user = prompt("Enter your name");//ตั้งชื่อผู้ใช้

var peer = new Peer({ //กำหนดค่า peer 
  host: '127.0.0.1',//กำหนด ip address 
  port: 3333,//กำหนด port การใช้งาน
  path: '/peerjs', //เรียกใช้ จากหน้า /peerjs
  config: { //การกำหนดค่า
    'iceServers': [
      { url: 'stun:stun01.sipphone.com' },
      { url: 'stun:stun.ekiga.net' },
      { url: 'stun:stunserver.org' },
      { url: 'stun:stun.softjoys.com' },
      { url: 'stun:stun.voiparound.com' },
      { url: 'stun:stun.voipbuster.com' },
      { url: 'stun:stun.voipstunt.com' },
      { url: 'stun:stun.voxgratia.org' },
      { url: 'stun:stun.xten.com' },
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credentials: 'openrelayproject'
      }
      // {
      //   url: 'turn:192.158.29.39:3478?transport=tcp',
      //   credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      //   username: '28224511:1379330808'
      // }
    ]
  },

  debug: 3//แสดงค่า debug ออกมาทั้งหมด
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({ //function เรียกใช้ กล้องกับ ไมค์
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      console.log('someone call me');
      call.answer(stream);
      const video = document.createElement("video");//สร้างตัวแปร มาเก็บค่า ที่เรียกใช้ คำสั่งเข้าถึง element class:video
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

const connectToNewUser = (userId, stream) => {
  console.log('I call someone' + userId);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");//สร้างตัวแปร มาเก็บค่า ที่เรียกใช้ คำสั่งเข้าถึง element class:video
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

peer.on("open", (id) => {
  console.log('my id is' + id);
  socket.emit("join-room", ROOM_ID, id, user);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

let text = document.querySelector("#chat_message");//สร้างตัวแปร มาเก็บค่า ที่เรียกใช้ คำสั่งเข้าถึง element id:messages
let send = document.getElementById("send");//สร้างตัวแปร มาเก็บค่า ที่เรียกใช้ คำสั่งเข้าถึง element 
let messages = document.querySelector(".messages");//สร้างตัวแปร มาเก็บค่า ที่เรียกใช้ คำสั่งเข้าถึง element class:messages

send.addEventListener("click", (e) => {//function ปุ่มกดส่งข้อความ
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {//function ส่งข้อความโดยกด Enter
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
muteButton.addEventListener("click", () => { //function ปุ่มปิดไมค์
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {//function ปุ่มปิดกล้อง
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

inviteButton.addEventListener("click", (e) => {// //function ปุ่ม แชร์ลิ้งค์เชิญเพื่อน
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${userName === user ? "me" : userName
    }</span> </b>
        <span>${message}</span>
    </div>`;
});