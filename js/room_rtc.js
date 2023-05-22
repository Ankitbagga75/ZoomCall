const APP_ID = "88259f29840643ad8f4f4bbc29abd87a"

let uid = sessionStorage.getItem('uid')
if (!uid){
    uid = String(Math.floor(Math.random()*10000))
    sessionStorage.setItem('uid',uid)
}

let token = null;
let client;

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
let roomId = urlParams.get('room')

if (!roomId){
    roomId ='main'
}
// roomID = room.html?room=1223


let localTracks = []
let remoteUsers = {
}

let joinRoomInit = async()=>{
    client =  AgoraRTC.createClient({mode:'rtc',codec:'vp8'})
    await client.join(APP_ID,roomId,token,uid)
    client.on('user-published',handleUserPublished)
    client.on('user-left',handleUserLeft)
    joinStream()
}

let joinStream = async()=>{
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
    
    let player = `<div class="video__container" id="user-container-${uid}">
                     <div class ="video-player" id="user-${uid}"></div>
                  </div>`

    document.getElementById('streams__container').insertAdjacentHTML('beforeend',player)
    document.getElementById(`user-container-${uid}`).addEventListener('click',expandVideoFrame)
    localTracks[1].play(`user-${uid}`)
    await client.publish([localTracks[1]])
}

let handleUserPublished = async(user, mediaType)=>{
    console.log("User :",user)
    remoteUsers[user.uid] = user
    await client.subscribe(user,mediaType)
    let player = document.getElementById(`user-container-${user.uid}`)
    if (player === null){
     player = `<div class="video__container" id="user-container-${user.uid}">
                     <div class ="video-player" id="user-${user.uid}"></div>
                  </div>`
                  
        document.getElementById('streams__container').insertAdjacentHTML('beforeend',player)
        document.getElementById(`user-container-${uid}`).addEventListener('click',expandVideoFrame)
    }

    if (displayFrame.style.display){
        player.style.height = '100%'
        player.style.width = '100%'

    }
    if (mediaType === 'video'){
        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio'){
        user.audioTrack.play()
    }

    console.log('UserId:',user.uid)
}

let handleUserLeft = async (user) =>{
    delete remoteUsers[user.uid]
    let item = document.getElementById(`user-container-${user.uid}`)
    if(item){
        item.remove()
    }
}
joinRoomInit()