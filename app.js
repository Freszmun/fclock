// load modules
const http = require('http'),
    express = require('express'),
    app = express(),
    sv = http.createServer(app),
    io = require('socket.io')(sv);
// init server and load weather module
app.use(express.static('./public'));
sv.listen(3000);
require('./weather');

// init connection listener
io.on('connection', socket => {
    // initialize socket
    socket.join('notifications');
    // listen weather requests
    socket.on('get_weather',() => {
        socket.emit('weather',weather);
    })
    // send welcome info
    notify('info', 'Welcome', 5000, socket);
    // after 2s send message to all devices about new connected device
    setTimeout(() => {
      notify('alert', 'New device connected' ,10000);
    }, 2000);
});

// sending notification to single socket/notification channel
// type, text (max 200), visibility time | null - 5000, socket | null - everyone)
function notify(type, text, time = 5000, socket) {
    let icon = 'fas fa-exclamation-triangle'; // alert, default
    switch(type){
        case 'info': icon = 'fas fa-info-circle';break;
        case 'action': icon = 'fas fa-briefcase';break;
        case 'email': icon='fas fa-envelope';break;
        case 'error': icon = 'fas fa-bug';break;
        case 'reminder': icon = 'fas fa-bell';break;
    }
    // max noification message length: 200 charactes
    text = text.substr(0, 200);
    time = (time < 300) ? 4000 : time;
    // send to socket or notifications channel
    (socket ? socket : io.to('notifications')).emit('notification', {
      type: type,
      icon: `<i class="${icon}"></i>`,
      text: text,
      timeout: time
    });
}

// weather data listener
global.onWeather = function(temp, name) {
    // special warnings
    if (name === 'tornado') notify('alert', 'Forecast tornado warning', 360000);
    // join dark side...
    if (temp > 39) notify('alert', 'Hight temperature alert. Stay in shadows and wait for darkness', 360000);
}

// testing, having fun with notifications
let stdin = process.openStdin();
stdin.addListener("data", function(d) {
    d = d.toString().trim();
    notify(['alert', 'info', 'action', 'email', 'error', 'reminder'][Math.round(Math.random() * 7)], d, 10000)
});
