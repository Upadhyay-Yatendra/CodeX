
import bot from './assets/bot.svg'
import user from './assets/user.svg'

const handleSubmit = async (e) => {
    
    e.preventDefault();

    const data = new FormData(form);

    // user's chatStripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset();

    //bot's chatStripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

      // Scroll to the bottom only if the chat tab is active
      if (document.visibilityState === 'visible') {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    // fetch data from the server 
    const response = await fetch('https://codex-a13i.onrender.com',{
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
// Function to load the answer letter by letter and scroll down
function typeText(element, text) {
    let index = 0;
    const intervalDuration = 20;

    const scrollDown = () => {
        element.scrollTop = element.scrollHeight;
    };

    const interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            scrollDown(); // Scroll down after adding each character
        } else {
            clearInterval(interval);
            scrollDown(); // Ensure scrolling down even when typing is finished
        }
    }, intervalDuration);
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


// Add an event listener for visibility changes
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
        // If the tab becomes visible, call handleSubmit to continue processing messages
        handleSubmit({ keyCode: 13 });
    }
});
// Modify the form submit event listener
form.addEventListener('submit', (e) => {
    handleSubmit(e);
});

form.addEventListener('keyup', async (e) => {
    if (e.keyCode === 13) {
        // Check if the tab is visible before calling handleSubmit
        if (document.visibilityState === 'visible') {
            await handleSubmit(e);
        }
    }
});


document.getElementById("scrollToTop").addEventListener('click',scrollToTop);
document.getElementById("scrollToBottom").addEventListener('click',scrollToBottom);

// Show/hide the buttons when scrolling

window.onscroll = function() {
    const scrollToTopButton = document.getElementById('scrollToTop');
    const scrollToBottomButton = document.getElementById('scrollToBottom');
    const scrollOffset = document.body.scrollTop || document.documentElement.scrollTop;

    if (scrollOffset > 100) {
        scrollToTopButton.style.display = 'block';
        scrollToBottomButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
        scrollToBottomButton.style.display = 'none';
    }
}

 // Function to scroll to the top of the page
 function scrollToTop() {
        console.log('Scrolled to Top');
        window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to scroll to the bottom of the page
function scrollToBottom() {
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        window.scrollTo({ top: document.body.scrollHeight - windowHeight, behavior: 'smooth' });
}
