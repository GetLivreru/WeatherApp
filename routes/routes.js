const { Router } = require('express');
const axios = require('axios');
const { windDirection } = require('./index.js');
const { client, connectToDatabase } = require('../db/db.js');
const router = Router();

router.get('/', (req, res) => {
  res.sendFile(__dirname + './public/index.html');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
      const usersCollection = client.db("users").collection("users");
      const existingUser = await usersCollection.findOne({ username: username });
  
      if (existingUser) {
        res.status(400).send('User already exists');
      } else {
        const newUser = { username: username, password: password };
        const result = await usersCollection.insertOne(newUser);
        
        if (result.insertedCount === 1) {
          res.status(201).send('User registered successfully');
        } else {
          res.status(500).send('Failed to register user');
        }
      }
    } catch (error) {
      console.error('Error processing signup request:', error);
      res.status(500).send('Internal server error');
    }
  });
  router.post('/weather', async (req, res) => {
    const city = req.body.city;
  
    try {
      const apiKey = '94b07001ec1f4be8df8aa962a94b7dad';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      
      const response = await axios.get(apiUrl);
      const weatherData = response.data;
  
      const weatherInfo = {
        description: `Description: ${weatherData.weather[0].description}`,
        temperature: `Temperature: ${weatherData.main.temp}°C`,
        pressure: `Pressure: ${weatherData.main.pressure} hPa`,
        humidity: `Humidity: ${weatherData.main.humidity}%`,
        wind: `Wind: ${weatherData.wind.speed} m/s, ${windDirection(weatherData.wind.deg)}`,
        precipitation: `Probability of precipitation: ${weatherData.clouds.all}%`
      };
  
      res.send(weatherInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving weather data');
    }
  });

  router.get('/worldmap', async (req, res) => {
    try {
      const apiKey = '462ee39a55b94b188ce11bf99aa63c7c'; // Замените на свой API-ключ Geoapify
      const city = req.query.city; // Получаем город из запроса
  
      // Создаем запрос к Geoapify API для получения информации о погоде
      const apiUrl = `https://api.geoapify.com/v2/weather/current?city=${city}&apiKey=${apiKey}`;
  
      const response = await axios.get(apiUrl);
      const weatherData = response.data;
  
      // Формируем объект с необходимой информацией о погоде
      const weatherInfo = {
        city: weatherData.properties.city,
        temperature: weatherData.properties.temperature,
        humidity: weatherData.properties.humidity,
        windSpeed: weatherData.properties.windSpeed,
        description: weatherData.properties.weather.description
      };
  
      res.json(weatherInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving weather data from Geoapify API');
    }
  });
  router.get('/news', async (req, res) => {
    try {
      const newsApiKey = '714b33fc8b2a4e5e872b460be22d6e6c'; // Replace with your actual News API key
      const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`;
  
      const response = await axios.get(newsApiUrl);
      const articles = response.data.articles;
  
      const newsInfo = articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
      }));
  
      res.send(newsInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving news data');
    }
  });
  
module.exports = function(app) {
  app.use('/', router);
};