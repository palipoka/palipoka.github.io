// API ключ для OpenWeatherMap
const API_KEY = "b48b4a20ece56d05098944726adf5c95";
let currentCity = "Moscow,ru";

// Weather functionality with OpenWeatherMap API
async function getWeather(city = currentCity) {
    try {
        // Показываем состояние загрузки
        document.getElementById("description").textContent = "Загрузка...";
        document.getElementById("temp_curr").innerHTML = "--°C";
        document.getElementById("temp_low").innerHTML = "--°";
        document.getElementById("temp_high").innerHTML = "--°";
        document.getElementById("humidity").textContent = "--%";
        document.getElementById("wind").textContent = "-- м/с";
        document.getElementById("pressure").textContent = "-- гПа";
        
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
        );
        
        if (!response.ok) {
            throw new Error("Ошибка получения данных о погоде");
        }
        
        const data = await response.json();
        updateWeatherUI(data);
        
    } catch (error) {
        console.error("Ошибка:", error);
        document.getElementById("description").textContent = "Ошибка загрузки";
        document.getElementById("temp_curr").innerHTML = "?°C";
    }
}

function updateWeatherUI(data) {
    const tempCurr = Math.round(data.main.temp);
    const tempLow = Math.round(data.main.temp_min);
    const tempHigh = Math.round(data.main.temp_max);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const pressure = data.main.pressure;
    const iconCode = data.weather[0].icon;

    document.getElementById("description").textContent = description;
    document.getElementById("temp_curr").innerHTML = `${tempCurr}°C`;
    document.getElementById("temp_low").innerHTML = `${tempLow}°`;
    document.getElementById("temp_high").innerHTML = `${tempHigh}°`;
    document.getElementById("humidity").textContent = `${humidity}%`;
    document.getElementById("wind").textContent = `${windSpeed} м/с`;
    document.getElementById("pressure").textContent = `${pressure} гПа`;
    
    updateWeatherIcon(iconCode);
}

function updateWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'fa-sun',
        '01n': 'fa-moon',
        '02d': 'fa-cloud-sun',
        '02n': 'fa-cloud-moon',
        '03d': 'fa-cloud',
        '03n': 'fa-cloud',
        '04d': 'fa-cloud',
        '04n': 'fa-cloud',
        '09d': 'fa-cloud-showers-heavy',
        '09n': 'fa-cloud-showers-heavy',
        '10d': 'fa-cloud-sun-rain',
        '10n': 'fa-cloud-moon-rain',
        '11d': 'fa-bolt',
        '11n': 'fa-bolt',
        '13d': 'fa-snowflake',
        '13n': 'fa-snowflake',
        '50d': 'fa-smog',
        '50n': 'fa-smog'
    };
    
    const weatherIcon = document.getElementById('weather-icon');
    if (weatherIcon && iconMap[iconCode]) {
        // Сохраняем классы fa и fas, меняем только иконку
        weatherIcon.className = `fas ${iconMap[iconCode]}`;
    }
}

// City selector functionality
function setupCitySelector() {
    const cityButtons = document.querySelectorAll('.city-btn');
    
    cityButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            cityButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс к текущей кнопке
            this.classList.add('active');
            
            // Обновляем погоду для выбранного города
            currentCity = this.getAttribute('data-city');
            getWeather(currentCity);
        });
    });
}

// Start when page loads
document.addEventListener('DOMContentLoaded', function() {
    getWeather();
    setupCitySelector();
    
    // Обновляем погоду каждые 30 минут
    setInterval(() => getWeather(currentCity), 30 * 60 * 1000);
});
