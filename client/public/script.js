const socket = io.connect("http://45.141.151.164:8000");

const username = prompt("What is your name?");
if (!username) window.location.reload();

document.querySelectorAll(".chat-container").forEach(chatCard => {
    chatCard.querySelector("form").onsubmit = e => {
        e.preventDefault();
        const messageInput = e.target.querySelector("input.text_input");
        const message = messageInput.value.trim();
		if(!message) return messageInput.value = '';
        chatCard.querySelector(".chat").innerHTML += `<li class="message">
		<div style="width: 100%; display: flex; justify-content: center; align-items: start; gap: 5px;">
        <div class="profile-header">
          <h4>${username}</h4>
          <img class="logo" src="https://randomuser.me/api/portraits/men/67.jpg" alt="">
        </div>
		<div class="message-content">
          <p class="message-text">${message}</p>
		</div>
		</div>
		<span class="time" style="position: absolute; bottom: 0; right: 2%; transform: translateY(-20px); color: #aaa;">${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </li>`;
        chatCard.height = `${chatCard.querySelectorAll(".message").length * 50}vh`;
        messageInput.value = '';
        socket.send({
            "username": username,
            "html_data": chatCard.querySelector(".chat").innerHTML,
            "message": message
        });
		socket.emit("keydown", username);
    }
});

const wait = ms => new Promise(r => setTimeout(r, ms));

socket.on("keydown", username => {
    const isWriting = document.querySelector(".is-writing");
    const isHide = getComputedStyle(isWriting).display !== "none";
    if (!isHide) {
        isWriting.style.display = "block";
        isWriting.innerHTML = `${username} yazıyor...`;
    } else {
        isWriting.style.display = "none";
        isWriting.innerHTML = '';
    }
});

const chat_input = document.querySelector(".chat-container input.text_input");

chat_input.addEventListener("input", e => {
    if (!chat_input.value.trim()) socket.emit("keydown", username);
})

window.addEventListener("keydown", async key => {
    //if (key.code === "Enter")
	if(!chat_input.value.trim()) return;
    if (getComputedStyle(document.querySelector(".is-writing")).display === "none") socket.emit("keydown", username);
});

socket.on("device", deviceData => {
    document.querySelector(".chat-container .device-count").innerHTML = `<img width="25px" height="25px"
    src="https://cdn3.iconfinder.com/data/icons/flat-set-1/64/flat_set_1-25-256.png" alt="device"> ${deviceData}`;
});

socket.on("message", data => {
	const chat_element = document.querySelector(".chat-container");
    chat_element.querySelector(".chat").innerHTML = data;
	chat_element.scrollTop += chat_element.querySelectorAll(".message").length * 100;
});