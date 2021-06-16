const http = require('http'),
    // TODO: configure weather-config.json file
    // openweathermap app id required, put this in weather-config.json
     weatherConfig = require('./weather-config.json');

// default weather info (waiting for data)
global.weather = {
    temp: '<i class="far fa-clock"></i>',
    icon: '<i class="far fa-clock"></i>'
}

// select weather icon by name, if not defined: google icon (search on google)
function weatherIcon(name)
{
    let icon = 'fab fa-google';
    switch(name.toLowerCase())
    {
        case 'few clouds': icon = 'fas fa-cloud-sun'; break;
        case 'clouds': icon = 'fas fa-cloud'; break;
        case 'scattered clouds': icon = 'fas fa-cloud'; break;
        case 'broken clouds': icon = 'fas fa-cloud-showers-heavy'; break;
        case 'shower rain': icon = 'fas fa-cloud-showers-heavy'; break;
        case 'rain': icon = 'fas fa-cloud-rain'; break;
        case 'thunderstorm': icon = 'fas fa-bolt'; break;
        case 'snow': icon = 'far fa-snowflake'; break;
        case 'mist': icon = 'fas fa-smog'; break;
        case 'clear sky': icon = 'fas fa-sun'; break;
        case 'clear': icon = 'fas fa-sun'; break;
    }
    return `<i class="${icon}"></i>`
}

// process weather info
function parseWeather(s) {
    let j = {};
    try {
        j = JSON.parse(s);
    } catch(e) {
        return console.log(e);
    }
    global.weather = {
        temp: j.main.temp,
        icon: weatherIcon(j.weather[0].main)
    };
    // call weather listener if is defined
    if (onWeather) onWeather(j.temp, j.weather[0].main);
}

// get weather data
function getWeather(){
    http.get(`http://api.openweathermap.org/data/2.5/weather?id=${weatherConfig.locationID}&units=${weatherConfig.units}&appid=${weatherConfig.appid}`, (res) => {
        let bb='';
        res.on('data',(chk) => {
            if (chk) bb += chk.toString();
        }).on('end',() => {
            parseWeather(bb);
        });
    })
}

// auto refresh
setTimeout(getWeather, 3000);
setInterval(getWeather, 600000); // 1h refresh interval
