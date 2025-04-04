//Импорты
const express = require('express');
const path = require('path');
const { middleware } = require('../middleware/middleware'); // Импортируем middleware
const urls = require('../urls/urls.js'); // Импортируем urls
const app = express();
const port = 3000;

//Middleware для использования шаблонов и статических файлов(js, css, img)
app.use('/static', express.static(path.join(__dirname, '../templates/static')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../templates/template'));

// Используем middleware
app.use(middleware);

// Используем маршруты
app.use(urls);

// Запуск сервера
app.listen(port, () => {
  console.log('Сервер работает на http://localhost:' + port);
});

//Экспорт
module.exports = app;
