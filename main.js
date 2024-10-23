const mirzohidselectorBtn = document.querySelector('#mirzohid-selector');
const userselectorBtn = document.querySelector('#user-selector');
const chatHeader = document.querySelector('.chat-header');
const chatMessages = document.querySelector('.chat-messages');
const chatInputForm = document.querySelector('.chat-input-form');
const chatInput = document.querySelector('.chat-input');
const clearChatBtn = document.querySelector('.clear-chat-button');

let messages = JSON.parse(localStorage.getItem('messages')) || [];

const createchatMessageElement = (message, index) => `
    <div class="message ${message.sender === "Mirzohid" ? 'blue-bg' : 'gray-bg'}" data-index="${index}">
        <div class="message-sender">${message.sender}</div>
        <div class="message-text">${message.text}</div>
        <div class="message-timestamp">${message.timestamp}</div>
        <button class="button edit-button" data-index="${index}">Edit</button>
        <button class="button delete-button" data-index="${index}">Delete</button>
    </div>
`;

const renderMessages = () => {
    chatMessages.innerHTML = '';
    messages.forEach((message, index) => {
        chatMessages.innerHTML += createchatMessageElement(message, index);
    });
};

window.onload = () => {
    renderMessages();
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

let messageSender = "Mirzohid";
const updateMessageSender = (name) => {
    messageSender = name;
    chatHeader.innerText = `${messageSender} chatting...`;
    chatInput.placeholder = `Type here, ${messageSender}...`;

    if (name === "Mirzohid") {
        mirzohidselectorBtn.classList.add('active-person');
        userselectorBtn.classList.remove('active-person');
    } else {
        userselectorBtn.classList.add('active-person');
        mirzohidselectorBtn.classList.remove('active-person');
    }

    chatInput.focus();
};

mirzohidselectorBtn.onclick = () => updateMessageSender('Mirzohid');
userselectorBtn.onclick = () => updateMessageSender('User');

const sendMessage = (e) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const message = {
        sender: messageSender,
        text: chatInput.value,
        timestamp,
    };

    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
    renderMessages();
    chatInputForm.reset();
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

const handleEditMessage = (index) => {
    const messageTextElement = chatMessages.querySelector(`[data-index="${index}"] .message-text`);
    const editButton = chatMessages.querySelector(`[data-index="${index}"] .edit-button`);

    if (editButton.innerText === 'Edit') {
        messageTextElement.contentEditable = true;
        messageTextElement.focus();
        editButton.innerText = 'Save';
    } else {
        messages[index].text = messageTextElement.innerText;
        localStorage.setItem('messages', JSON.stringify(messages));
        messageTextElement.contentEditable = false;
        editButton.innerText = 'Edit';
    }
};

const handleDeleteMessage = (index) => {
    messages.splice(index, 1);
    localStorage.setItem('messages', JSON.stringify(messages));
    renderMessages();
};

chatMessages.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-button')) {
        const index = e.target.getAttribute('data-index');
        handleEditMessage(index);
    }

    if (e.target.classList.contains('delete-button')) {
        const index = e.target.getAttribute('data-index');
        handleDeleteMessage(index);
    }
});

chatInputForm.addEventListener('submit', sendMessage);
clearChatBtn.addEventListener('click', () => {
    localStorage.clear();
    messages = [];
    chatMessages.innerHTML = '';
});
