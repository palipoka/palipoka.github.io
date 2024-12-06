const apiKey = "b48b4a20ece56d05098944726adf5c95";
const city = "Moscow,ru"; // Убедитесь, что это правильно

// Добавьте параметр lang=ru для вывода описания погоды на русском языке
const jsonUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

fetch(jsonUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error("Ошибка сети: " + response.statusText);
    }
    return response.json();
  })
  .then(jsonObj => {
    const tempCurr = jsonObj.main.temp.toFixed(0);
    const tempLow = jsonObj.main.temp_min.toFixed(0);
    const tempHigh = jsonObj.main.temp_max.toFixed(0);
    const description = jsonObj.weather[0].description; // Обратите внимание на изменения здесь

    insertWeatherInfo(tempCurr, tempLow, tempHigh, description);
  })
  .catch(error => {
    console.error("Произошла ошибка при выполнении запроса:", error);
  });

function insertWeatherInfo(tempCurr, tempLow, tempHigh, description) {
  $("#description").text(description);
  $("#temp_curr").html(`${tempCurr}&deg;`);
  $("#temp_low").html(`${tempLow}&deg; /`);
  $("#temp_high").html(`${tempHigh}&deg;`);
}
