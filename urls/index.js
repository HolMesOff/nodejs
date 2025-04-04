wESGH#32RWf#FAW32

//Импорты
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { tokenVerification } = require("../middleware/middleware"); // Импортируем функцию из middleware для проверки токена
const main = require('./main') 


//Маршруты для рендера HTML-кода сайта у входа/регистрации
//На сайтах проходит проверка токена, если есть, отправляем на сайт, если нет - на вход / регистрацию
router.get('/register', tokenVerification, (req, res) =>{
	if (!req.user){
		res.render('register');
	}else{
		res.redirect('/');
	}
})

//Отправляем GET-запрос, и обрабатываем его в main.js
router.get('/', tokenVerification, main.index);


// Получение конкретного отчета
router.get('/report/:id', tokenVerification, main.getReport);
router.get('/subreport/:parent_id', tokenVerification, main.getSubReport);


// Маршруты для POST-запроса регистрации на сайте
router.post('/register', async (req, res) =>{
	const {name, password, confirm_password} = req.body;


	if (!name || !password || !confirm_password) {
	    return res.status(400).json({error: "Поля должны быть заполнены!" });
	}

	if (password != confirm_password){
		return res.status(403).json({error: "Пароли не совпадают" });
	}

	// Проверяем, существует ли пользователь с таким именем
	const [testName] = await req.Connection.promise().query('SELECT COUNT(*) AS count FROM users WHERE name = ?', [name]);

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	if (testName[0].count > 0){
		return res.status(409).json({error: "Такой пользователь уже существует!"})
	}

	const query = 'INSERT INTO users (name, password, role) VALUES (?, ?, ?)'; // Вставка данных в БД
	req.Connection.query(query, [name, hashedPassword, 'user'], (err, results) => {
		if (err) {
			return res.status(500).json({ error: 'Ошибка при регистрации' });
		}
		return res.status(200).json({ text: 'Регистрация прошла успешно!'})
	});
});


// Маршруты для POST-запроса входа на сайт
router.post('/', async (req, res) => {

	const {name, password} = req.body;

	if (!name || !password) {
	    return res.status(400).json({ error: "Поля должны быть заполнены!" });
	}

	// Проверяем, существует ли пользователь с таким именем
	const [testName] = await req.Connection.promise().query('SELECT COUNT(*) AS count FROM users WHERE name = ?', [name]);

	if (testName[0].count == 0){
		return res.status(409).json({error: "Данный пользователь не найден!"});
	}

	// Получаем хешированный пароль из базы данных
	const [storedUser] = await req.Connection.promise().query('SELECT password, role FROM users WHERE name = ?', [name]);

	const storedPassword = storedUser[0].password;
	const storedRole = storedUser[0].role;

	// Сравниваем введённый пароль с хешированным в базе данных
	const isTruePassword = await bcrypt.compare(password, storedPassword);

	if (!isTruePassword){
		return res.status(401).json({error: "Неверный пароль!"});
	}

	const token = jwt.sign( {name}, req.secretKey, {expiresIn: '1h'} ); // Создание токена с httpOnly(только по запросу!)
	res.cookie('token', token, {
		'httpOnly': true,
		maxAge: 3600000
	});

	return res.status(200).json({ text: 'Авторизация прошла успешно!'});
});


//Вызываем команду для выхода из сайта
router.get('/logout', tokenVerification, (req, res) =>{
	if (!req.user){
		res.redirect('/');
	}else{
		res.clearCookie('token');
		res.status(200).json({message: "Выход прошел успешно!"});
	}
})




//Экспорт
module.exports = router;