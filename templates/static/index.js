let form_class;  // Хранение класса формы для входа / регистрации
let body_list;  // Хранение полей, которые будут находиться на сайте входа / регистрации(пароль, логин, повторный пароль)

//Проверка сайта входа или регистрации, для наполнения переменных
if (window.location.pathname == '/') {
    form_class = ".login-form";
} else if (window.location.pathname == "/register") {
    form_class = ".register-form";
}

// Отслеживание кнопки submit в форме
document.querySelector(form_class).addEventListener("submit", async (event) => {

    event.preventDefault(); // Ставим на паузу обновление сайта, чтобы перенаправить json-ответ в js-файл

    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    let confirm_password;

    //Проверка сайта входа или регистрации, для наполнения переменных
    if (window.location.pathname == "/register") {
        confirm_password = document.getElementById("confirm_password").value;
        body_list = {name, password, confirm_password};
    } else {
        body_list = {name, password}; 
    }

    //Отправляем на этот же сайт POST-запрос на серверную часть, для обработки запроса с данными body_list
    try {
        const response = await fetch(window.location.pathname, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body_list)
        });

        if (response.ok) {
            const result = await response.json(); 
            document.getElementById("message_error").textContent = result.text;
            document.getElementById("message_error").style.color = "green";
            document.getElementById("message_error").style.display = "block";
            window.location.pathname = "/";
        } else {
            const error = await response.json();
            document.getElementById("message_error").textContent = error.error;
            document.getElementById("message_error").style.color = "red";
            document.getElementById("message_error").style.display = "block";
        }
    } catch (error) {
        document.getElementById("message_error").textContent = "Ошибка при подключении к серверу!";
        document.getElementById("message_error").style.display = "block";
    }
});
