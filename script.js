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
        } else {
            alert('Location not found'); // Alert if the location is not found
        }
    } catch (error) {
        console.error('Error fetching weather data:', error); // Log any errors
    }
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