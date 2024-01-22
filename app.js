const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes/routes.js'); // Подключаем модуль с маршрутами

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

routes(app); // Передаем экземпляр приложения в модуль с маршрутами

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
