// Функция для сворачивания/разворачивания меню
const blockClicks = ['.toggle-btn', '.content']
blockClicks.forEach(block =>{
      document.querySelector(block).addEventListener('click', () => {
        
        if (block == '.toggle-btn'){
            document.getElementById('menu').classList.toggle('hidden');
        }else if(block == ".content"){
            document.getElementById('menu').classList.remove('hidden');
        }
    });
});

document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        const response = await fetch('/logout', {
            method: "GET",
        });
        const result = response.json();
        if (response.ok) {
            window.location.href = "/"; 
        } else {
            console.log("Ошибка выхода: ", response);
        }
    } catch (error) {
        console.log("Ошибка выхода")
    }
});
