// Контроллер для главной страницы и отчетов

//Список категорий на сайте
const reports = [
  { id: 1, name: "Категория 1", description: "Описание отчета 1", parent_id: '' },
  { id: 2, name: "Категория 2", content: "Содержимое отчета 2", description: "Описание отчета 2", parent_id: 1, role: "admin" }, 
  { id: 3, name: "Категория 3", description: "Описание отчета 3", parent_id: 1 }, 
  { id: 4, name: "Категория 4", content: "Содержимое отчета 4", description: "Описание отчета 4", parent_id: 1},
  { id: 5, name: "Категория 5", content: "Содержимое отчета 5", description: "Описание отчета 5", parent_id: 3 }, 
  { id: 6, name: "Категория 6", content: "Содержимое отчета 6", description: "Описание отчета 6", parent_id: '' },
];


// Функция рендеринга главной страницы
exports.index = (req, res) => {
    if (!req.user) {
        res.render('index');
    } else {
        res.render('hello', { reports });
    }
};

// Функция получения данных по отчету
exports.getReport = (req, res) => {

    if (!req.user) {
        res.redirect('/');
    }else{
        const reportId = parseInt(req.params.id); //Получаем запрос на отчет(по айди)
        const report = reports.find(r => r.id === reportId); 

        //Проверяем заголовок отношения. Если он none значит это не запрос, а пользователь
        if (req.get('sec-fetch-site') == "none"){
            return res.status(403).json({error: "Доступ запрещен для пользователя!"});
        }

        if (report) {
            if (!report.role || report.role == req.role){
                res.json(report);
            }else if (report.role != req.role){
                res.status(403).json({error: "Доступ запрещен!"})
            }
        } else {
            res.status(404).json({ error: 'Отчет не найден!' });
        }
    }
};

// Функция получения категорий
exports.getSubReport = (req, res) => {

    if (!req.user) {
        res.redirect('/');
    }else{
        const parentId  = parseInt(req.params.id); //Получаем запрос на отчет(по айди)
        const report = reports.find(r => r.parent_id === parentId); 

        //Проверяем заголовок отношения. Если он none значит это не запрос, а пользователь
        if (req.get('sec-fetch-site') == "none"){
            return res.status(403).json({error: "Доступ запрещен для пользователя!"});
        }

        if (report) {
            if (!report.role || report.role == req.role){
                res.json(report);
            }else if (report.role != req.role){
                res.status(403).json({error: "Доступ запрещен!"})
            }
        } else {
            res.status(404).json({ error: 'Отчет не найден!' });
        }
    }
};