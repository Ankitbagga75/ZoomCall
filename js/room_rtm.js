let handleMemberJoined = async(MemberId) => {
    console.log('A New Member joined the room',MemberId)
}

let addMemberToDom = async(MemberId) => {
    let membersWrapper = document.getElementById('member__list')
    let memberItem = `<div class="member__wrapper" id="member__1__wrapper">
    <span class="green__icon"></span>
    <p class="member_name">${MemberId}</p></div>`

    membersWrapper.insertAdjacentElement('beforeend',memberItem)
}

let handleMemberLeft = async(MemberId) =>{
    removeMemberFromDom(MemberId)
}

let removeMemberFromDom = async(MemberId)=>{
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`)
    memberWrapper.remove()
}

let leaveChannel = async()=>{
    await channel.leave()
    await rtmClient.logout()
}

window.addEventListener('beforeend',leaveChannel)