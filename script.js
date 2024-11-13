// script.js
const apiKey = 'd5838a197007762851ecd7fac1d62b51';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=' + apiKey;

async function getWeather() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        document.getElementById('current-weather').innerText = `Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

getWeather();