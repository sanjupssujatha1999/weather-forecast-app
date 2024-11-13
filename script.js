// script.js
const apiKey = 'd5838a197007762851ecd7fac1d62b51';
const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

document.getElementById('search-button').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeatherByCity(city);
        addRecentCity(city);
    } else {
        alert('Please enter a city name');
    }
});

document.getElementById('location-button').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherByLocation(latitude, longitude);
        }, error => {
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
});

document.getElementById('recent-cities').addEventListener('change', (event) => {
    const city = event.target.value;
    if (city) {
        getWeatherByCity(city);
    }
});

async function getWeatherByCity(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.cod === 200) {
            document.getElementById('current-weather').innerText = `Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}, Humidity: ${data.main.humidity}%, Wind Speed: ${data.wind.speed} m/s`;
            document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        } else {
            alert('City not found');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function getWeatherByLocation(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.cod === 200) {
            document.getElementById('current-weather').innerText = `Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}, Humidity: ${data.main.humidity}%, Wind Speed: ${data.wind.speed} m/s`;
            document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        } else {
            alert('Location not found');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function addRecentCity(city) {
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
        updateRecentCitiesDropdown();
    }
}

function updateRecentCitiesDropdown() {
    const dropdown = document.getElementById('recent-cities');
    dropdown.innerHTML = '<option value="">Select a recent city</option>';
    recentCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        dropdown.appendChild(option);
    });
    dropdown.classList.remove('hidden');
}

updateRecentCitiesDropdown();