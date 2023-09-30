import bot from './assets/bot.svg'
import user from './assets/user.svg'

const handleSubmit = async (e) => {
    console.log("I came in handle Submit()");
    e.preventDefault();

    const data = new FormData(form);

    // user's chatStripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset();

    //bot's chatStripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    // fetch data from the server 
    const response = await fetch('http://localhost:5000',{
        method : 'POST',
        headers:{
            'Content-type' : 'application/json'
        },
        body : JSON.stringify({
            prompt : data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if(response.ok){
        const data = await response.json();
        const parsedData = data.bot.trim();
        
        typeText(messageDiv,parsedData);
    }
    else{
        const err = response.text();
        messageDiv.innerHTML = 'Something went wrong';
        alert(err);
    }

}


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;
// loads 3 dots until answer is loaded
function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300)
}

//  loads the answer letter by letter 
function typeText(element, text) {
    let index = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        }
        else {
            clearInterval(interval);
        }
    }, 20)
}

//  generate unique ids
function generateUniqueId() {
    //using time and date
    const timeStamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timeStamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {

    console.log("value of AI:->",isAi)
    return (
        `
        <div class="wrapper ${isAi ? 'ai' : ''}">

            <div class="chat">
                <div class = "profile">
                    <img 
                        src="${isAi ? bot : user}"
                        alt="${isAi ? 'bot' : 'user'}"
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
        `
    )
}


form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', async (e) => {
    if (e.keyCode === 13) {
        await handleSubmit(e); // Use await here
    }
})
