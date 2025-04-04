//Импорты
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const express = require('express');

//Ключ для JWT
const secretKey = 'fg4G34fv$34g';

// Создаём Router вместо использования app
const middleware = express(); 

//Middleware
middleware.use(express.urlencoded({ extended: true })); 
middleware.use(express.json()); //Использование json-формата
middleware.use(cookieParser()); //Использование куки-парсера

// Подключение к базе данных
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'rootroot',
  database: 'nodejs'
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключение к базе данных успешно!');
});


// Middleware для подключения БД в других модулях
middleware.use((req, res, next) => {
  req.Connection = connection;
  req.secretKey = secretKey;
  next();
});


// Middleware для проверки JWT
const tokenVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Получаем токен у клиента                

    if (!token) {
      return next();
    }

    // Проверяем токен
    jwt.verify(token, secretKey, async (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Неверный или истекший токен!" });
      }

      // Получаем роль пользователя из базы данных
      const [rows] = await connection.promise().query('SELECT role FROM users WHERE name = ?', [user.name]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Пользователь не найден!" });
      }

      req.role = rows[0].role;  // Устанавливаем роль пользователя в req
      req.user = user;  // Устанавливаем данные пользователя в req

      next(); // Переходим к следующему middleware или маршруту
    });
  } catch (err) {
    // Обрабатываем другие ошибки
    return res.status(500).json({ error: "Произошла ошибка на сервере!" });
  }
};


//Экспорт
module.exports = { middleware, tokenVerification };
