const socket = io();
voice = null;
// get text to speech voice
try {
    let voices = window.speechSynthesis.getVoices();
    (voices.length >= 4) ? (voice = voices[4]) : (voice = voices[0]);
} catch(err) {
    console.log('Missing voice selection');
}

window.notification_layout = null;
// weather socket listener
socket.on('weather', weather => {
    document.getElementById('weather').innerHTML = `${weather.icon}<span>${weather.temp}°C</span>`;
})

// request weather data
function getWeather() {
    try {
        socket.emit('get_weather', '<');
    } catch(err) {
        console.log('Cannot socket.emit get_weather');
    }
}
// text to speech function
function tts(text){
    let msg = new SpeechSynthesisUtterance();
    msg.voice = voice;
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.pitch = 1.04; //0 to 2
    msg.text = text;
    msg.lang = 'en-US';
    msg.onerror = function(){}
    msg.onend = function(){}
    speechSynthesis.speak(msg);
}

// notification socket listener
socket.on('notification', notification => {
    // special action for notification type: alert
    if(notification.type === 'alert') {
        let sound = new Audio('error.mp3');
        sound.play();
        // speak alert notification
        setTimeout(() => {
          tts(notification.text)
        }, 1500);
    }
    // special action for notification type: reminder
    if(notification.type === 'reminder') {
        let sound = new Audio('reminder.mp3');
        sound.play();
        // speak reminder notification
        setTimeout(() => {
          tts(notification.text)
        },1500);
    }
    if(notification_layout) {
        // initialize notification element
        let elem = document.createElement('div');
        elem.setAttribute('class', 'notification');
        elem.timeout = notification.timeout;
        elem.innerHTML = `<span style="display:${((!!notification.icon) ? 'block' : 'none')}">${notification.icon}</span><p>${notification.text}</p>`;
        // colors by notification type
        switch(notification.type) {
            case 'info': elem.style = '--r: 0; --g: 255; --b: 30'; break;
            case 'email': elem.style = '--r: 255; --g: 135;- -b: 0'; break;
            case 'reminder': elem.style = '--r: 255; --g: 255; --b: 255'; break;
        }
        // show notification
        notification_layout.appendChild(elem);
        // create click callback
        let onclick = ()=> {
            // destroy auto-delete timeout
            clearTimeout(elem.timeout);
            // remove notification
            notification_layout.removeChild(elem);
        }
        // set notifiation auto-delete timeout
        elem.timeout = setTimeout(onclick,notification.timeout);
        // add click action
        elem.onclick = onclick;
    }
});
