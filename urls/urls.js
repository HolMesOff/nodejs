//Импорты
const express = require('express');
const indexRouters = require('./index'); //Импортируем контроллер для основных URL(/, /register, /logout)
const router = express.Router();   //Библиотека маршрутизации


//Все пути на сайте с отдельными js-обработчиками
//Рендер сайтов происходит в одном и том же js-файле с серверной обработкой!
router.use('/', indexRouters);


//Экспорт импортных библиотек
module.exports = router;