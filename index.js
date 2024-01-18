const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/weather', async (req, res) => {
  const city = req.body.city;

  try {
    const apiKey = '94b07001ec1f4be8df8aa962a94b7dad';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(apiUrl);
    const weatherData = response.data;

    res.send(`Current weather in ${city}: ${weatherData.weather[0].description}, Temperature: ${weatherData.main.temp}°C`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving weather data');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
