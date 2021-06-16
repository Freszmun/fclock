# Simple clock
Simple, easy to edit web app clock.
## Run
#### First step, install dependencies: `npm install`<br>
You need to create `weather-config.json` file. In this file we need to specify open weather map api params.<br>
```json
{
  "appid": "openweathermap app id",
  "units": "standard | metric | imperial",
  "locationID": "your location (city) id from openweathermap"
}
```
#### Useful links:
More info about appid on https://openweathermap.org/appid <br>
How to get location ID: http://bulk.openweathermap.org/sample/city.list.min.json.gz <br>
You can find your city id in downloaded json.<br>
#### Next step: `npm start` <br>
At least open http://localhost:3000/
## Editing
Everything works on express server and socket.io connection. You can add anything.
#### Built-in functionalities:
<ol>
    <li>notifications to all or single socket</li>
    <li>getting and processing weather information</li>
    <li>weather (too hot / tornado) alerts</li>
    <li>simple clock</li>
</ol>
Weather is refreshing once per hour. <br>
Reminders and alerts makes sound alerts.

----

### Pros & cons of this clock
#### Pros
<ul>
    <li>simple</li>
    <li>lightweight</li>
    <li>you can use your old mobile as clock</li>
    <li>easy to edit for your purposes</li>
    <li>works when server dies/shutdown - time&date only</li>
</ul>

#### Cons
<ul>
    <li>not secured, you can use this only in your local network by opening clock in browser by http://server_ip:3000/</li>
    <li>requires internet connection for font awesome (notifications)</li>
</ul>