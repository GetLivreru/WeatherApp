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

    const weatherInfo = `
      Current weather in ${city}:
      - Description: ${weatherData.weather[0].description}
      - Temperature: ${weatherData.main.temp}°C
      - Pressure: ${weatherData.main.pressure} hPa
      - Humidity: ${weatherData.main.humidity}%
      - Wind: ${weatherData.wind.speed} m/s, ${windDirection(weatherData.wind.deg)}
      - Probability of precipitation: ${weatherData.clouds.all}%
    `;

    res.send(weatherInfo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving weather data');
  }
});

// Функция для определения направления ветра по градусам
function windDirection(degrees) {
  if (degrees >= 337.5 || degrees < 22.5) {
    return 'North';
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return 'Northeast';
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return 'East';
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return 'Southeast';
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return 'South';
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return 'Southwest';
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return 'West';
  } else if (degrees >= 292.5 && degrees < 337.5) {
    return 'Northwest';
  } else {
    return 'Unknown';
  }
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
