// script.js
const apiKey = 'd5838a197007762851ecd7fac1d62b51'; // Your OpenWeatherMap API key
const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

// Event listener for the search button
document.getElementById('search-button').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim(); // Get the city name from the input field
    if (city) {
        getWeatherByCity(city); // Fetch weather data for the entered city
        addRecentCity(city); // Add the city to the recent cities dropdown
    } else {
        alert('Please enter a city name'); // Alert if the input field is empty
    }
});

// Event listener for the location button
document.getElementById('location-button').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords; // Get the user's current location
            getWeatherByLocation(latitude, longitude); // Fetch weather data for the current location
        }, error => {
            alert('Unable to retrieve your location'); // Alert if unable to get the location
        });
    } else {
        alert('Geolocation is not supported by your browser'); // Alert if geolocation is not supported
    }
});

// Event listener for the recent cities dropdown
document.getElementById('recent-cities').addEventListener('change', (event) => {
    const city = event.target.value; // Get the selected city from the dropdown
    if (city) {
        getWeatherByCity(city); // Fetch weather data for the selected city
    }
});

// Fetch weather data by city name
async function getWeatherByCity(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl); // Fetch data from the API
        const data = await response.json(); // Parse the JSON response
        if (data.cod === 200) {
            // Update the UI with the fetched weather data
            document.getElementById('current-weather').innerText = `Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}, Humidity: ${data.main.humidity}%, Wind Speed: ${data.wind.speed} m/s`;
            document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            getExtendedForecast(city); // Fetch extended forecast for the city
        } else {
            alert('City not found'); // Alert if the city is not found
        }
    } catch (error) {
        console.error('Error fetching weather data:', error); // Log any errors
    }
}

// Fetch weather data by geographic coordinates
async function getWeatherByLocation(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl); // Fetch data from the API
        const data = await response.json(); // Parse the JSON response
        if (data.cod === 200) {
            // Update the UI with the fetched weather data
            document.getElementById('current-weather').innerText = `Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}, Humidity: ${data.main.humidity}%, Wind Speed: ${data.wind.speed} m/s`;
            document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            getExtendedForecastByLocation(lat, lon); // Fetch extended forecast for the location
        } else {
            alert('Location not found'); // Alert if the location is not found
        }
    } catch (error) {
        console.error('Error fetching weather data:', error); // Log any errors
    }
}

// Fetch extended forecast by city name
async function getExtendedForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl); // Fetch data from the API
        const data = await response.json(); // Parse the JSON response
        if (data.cod === "200") {
            displayExtendedForecast(data); // Display the extended forecast
        } else {
            alert('City not found'); // Alert if the city is not found
        }
    } catch (error) {
        console.error('Error fetching extended forecast data:', error); // Log any errors
    }
}

// Fetch extended forecast by geographic coordinates
async function getExtendedForecastByLocation(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl); // Fetch data from the API
        const data = await response.json(); // Parse the JSON response
        if (data.cod === "200") {
            displayExtendedForecast(data); // Display the extended forecast
        } else {
            alert('Location not found'); // Alert if the location is not found
        }
    } catch (error) {
        console.error('Error fetching extended forecast data:', error); // Log any errors
    }
}

// Display the extended forecast
function displayExtendedForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear any existing forecast data

    // Filter the forecast data to get one entry per day (at noon)
    const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    dailyForecasts.forEach(forecast => {
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-day', 'w-full', 'md:w-1/3', 'p-4', 'bg-gray-200', 'm-2', 'rounded');

        const date = new Date(forecast.dt_txt).toLocaleDateString();
        const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
        const temp = `Temp: ${forecast.main.temp}°C`;
        const wind = `Wind: ${forecast.wind.speed} m/s`;
        const humidity = `Humidity: ${forecast.main.humidity}%`;

        forecastElement.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${date}</h3>
            <img src="${iconUrl}" alt="Weather Icon" class="w-12 h-12 mx-auto mb-2">
            <p>${temp}</p>
            <p>${wind}</p>
            <p>${humidity}</p>
        `;

        forecastContainer.appendChild(forecastElement);
    });
}

// Add a city to the recent cities dropdown
function addRecentCity(city) {
    if (!recentCities.includes(city)) {
        recentCities.push(city); // Add the city to the recent cities array
        localStorage.setItem('recentCities', JSON.stringify(recentCities)); // Save the recent cities to local storage
        updateRecentCitiesDropdown(); // Update the dropdown with the new city
    }
}

// Update the recent cities dropdown
function updateRecentCitiesDropdown() {
    const dropdown = document.getElementById('recent-cities');
    dropdown.innerHTML = '<option value="">Select a recent city</option>'; // Reset the dropdown options
    recentCities.forEach(city => {
        const option = document.createElement('option'); // Create a new option element
        option.value = city; // Set the value of the option
        option.textContent = city; // Set the text content of the option
        dropdown.appendChild(option); // Add the option to the dropdown
    });
    dropdown.classList.remove('hidden'); // Show the dropdown if it was hidden
}

// Initialize the recent cities dropdown on page load
updateRecentCitiesDropdown();