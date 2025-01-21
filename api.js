const apiKey = 'c7562835294de58dd46d61d80221e8ea';
const API_KEY = '8HkYL5pH0JqxRfxJ1NLapw==NPyNjcCpQwL7sKRU';
let cityTimeInterval; 
const cityList = document.getElementById('city-list');

fetchWeather('London');
fetchForecast('London');
function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateWeatherUI(data);
            updateCityTime(data.timezone);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}


function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            forecast(data);
            forecastHourly(data);
            
        })
        .catch(error => console.error('Error fetching weather data:', error));
}


function updateWeatherUI(data) {
    const kelvinToCelsius = kelvin => (kelvin - 273.15).toFixed(0);

    const temperature = document.querySelector('.temperatureNow');
    const temperatureLike = document.querySelector('.temperatureLike');
    const cityName = document.querySelector('.cityName');
    const pressure = document.querySelector('.pressure');
    const humidity = document.querySelector('.humidity');
    const speed = document.querySelector('.speed');
    const weather = document.querySelector('.weather');
    const weatherPicture = document.querySelector('.weatherPicture');
    const sunrise = document.querySelector('.sunrise');
    const sunset = document.querySelector('.sunset');
    const sunriseDate = new Date(data.sys.sunrise * 1000);
    const sunsetDate = new Date(data.sys.sunset * 1000);


        sunrise.textContent = sunriseDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        sunset.textContent = sunsetDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    temperature.textContent = `${kelvinToCelsius(data.main.temp)}°C`;
    temperatureLike.textContent = `Feels like: ${kelvinToCelsius(data.main.feels_like)}°C`;
    cityName.textContent = data.name;
    weather.textContent = data.weather[0].main;
    pressure.textContent =`${data.main.pressure}hPa`;
    humidity.textContent =`${data.main.humidity}%`;
    speed.textContent =`${data.wind.speed}km/h`;
    switch (data.weather[0].main.toLowerCase()) {
        case 'clouds':
            weatherPicture.src = 'images/cloudy.png';
            break;
        case 'clear':
            weatherPicture.src = 'images/sunny.png';
            break;
        case 'rain':
            weatherPicture.src = 'images/rainy.png';
            break;
        case 'snow':
            weatherPicture.src = 'images/snowy.png';
            break;

        default:
            weatherPicture.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    }
    
}


function updateCityTime(timezoneOffset) {
    const timeElement = document.querySelector('.time');
    const dayElement = document.querySelector('.day');
    if (cityTimeInterval) {
        clearInterval(cityTimeInterval);
    }

    const updateTime = () => {
        const utcNow = new Date(Date.now());

        const localTimezoneOffset = new Date().getTimezoneOffset() * 60000;
        const cityTime = new Date((utcNow.getTime() + (timezoneOffset * 1000)) + localTimezoneOffset);

        timeElement.textContent = cityTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        dayElement.textContent = cityTime.toLocaleDateString('en-US', {
            weekday: 'long',
            day: '2-digit',
            month: 'long'
        });
    };

    updateTime(); 
    cityTimeInterval = setInterval(updateTime, 1000);
}


function forecast(data){
    const kelvinToCelsius = kelvin => (kelvin - 273.15).toFixed(0);
        
    const midDayEntries = data.list.filter(midday=>{
        return midday.dt_txt.includes("12:00:00")
    })
    
    if (midDayEntries.length > 0) {
        const dailyTemp = document.querySelectorAll('.dailyTemp');
        const dailyDate = document.querySelectorAll('.dailyDate');
        const dailyIcon = document.querySelectorAll('.dailyIcon');

        midDayEntries.forEach((midDayEntry, index) => {
            if (dailyTemp[index]) {
                dailyTemp[index].textContent = `${kelvinToCelsius(midDayEntry.main.temp)}°C`;
            }
            if (dailyDate[index]) {
                const date = new Date(midDayEntry.dt_txt);
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const day = date.getDate();
                const suffix = day % 10 === 1 && day !== 11
                    ? "st"
                    : day % 10 === 2 && day !== 12
                    ? "nd"
                    : day % 10 === 3 && day !== 13
                    ? "rd"
                    : "th";

                dailyDate[index].textContent = `${days[date.getDay()]}, ${day}${suffix} ${months[date.getMonth()]}`;
            }
            
            if(dailyIcon[index]){
                switch (midDayEntry.weather[0].main.toLowerCase()) {
                    case 'clouds':
                        dailyIcon[index].src = 'images/cloudy.png';
                        break;
                    case 'clear':
                        dailyIcon[index].src = 'images/sunny.png';
                        break;
                    case 'rain':
                        dailyIcon[index].src = 'images/rainy.png';
                        break;
                    case 'snow':
                        dailyIcon[index].src = 'images/snowy.png';
                        break;
                    default:
                        dailyIcon[index].src = `http://openweathermap.org/img/wn/${midDayEntry.weather[0].icon}@2x.png`;
                }

            }
        }); 
    } else {
        document.querySelectorAll('.dailyTemp').forEach(temp => {
            temp.textContent = "N/A";
        });
        document.querySelectorAll('.dailyDate').forEach(date => {
            date.textContent = "N/A";
        });
        document.querySelectorAll('.dailyIcon').forEach(icon => {
            icon.textContent = "N/A";
        });
    }
}

function forecastHourly(data){
    const dt_txt = data.list;
    const groupedByDate = {};
    cloudIcon = document.querySelector('.cloudIcon');
    cloudIcon.textContent = `${data.list[0].clouds.all}%`;

    

    dt_txt.forEach(dt => {
        const date = dt.dt_txt.split(" ")[0];
        if (!groupedByDate[date]) {
            groupedByDate[date] = [];
        }
        groupedByDate[date].push(dt);
    });
    const hourlyDivs = document.querySelectorAll('.hourly');
    const currentDate = new Date().toISOString().split('T')[0]; 
    const todayForecast = groupedByDate[currentDate] || [];
    let index = 0; 
    const hourlyDivsArray = Array.from(hourlyDivs);


    todayForecast.forEach((entry, idx) => {
        const time = entry.dt_txt.split(" ")[1].split(":").slice(0, 2).join(":");
        const temp = (entry.main.temp - 273.15).toFixed(0); // Convert from Kelvin to Celsius
        const weatherIcon = `http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;

        if (hourlyDivsArray[index]) {
            const hourlyDiv = hourlyDivsArray[index];
            hourlyDiv.querySelector('.hourlyHour').textContent = time;
            hourlyDiv.querySelector('.hourlyTemp').textContent = `${temp}°C`;
            hourlyDiv.querySelector('.hourlyIcon').src = weatherIcon;
            hourlyDiv.querySelector('.hourlySpeed').textContent = `${entry.wind.speed} km/h`;
            hourlyDiv.querySelector('.hourlyArrow').style.transform = `rotate(${entry.wind.deg}deg)`;
            

            index++; // Move to the next div
        }
    });

    if (index < hourlyDivsArray.length) {
        const nextDay = getNextDay(currentDate); // Get the next day's date
        const nextDayForecast = groupedByDate[nextDay] || [];

        nextDayForecast.forEach((entry, idx) => {
            if (index < hourlyDivsArray.length) {
                const time = entry.dt_txt.split(" ")[1].split(":").slice(0, 2).join(":");
                const temp = (entry.main.temp - 273.15).toFixed(0); // Convert from Kelvin to Celsius
                const weatherIcon = `http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;

                const hourlyDiv = hourlyDivsArray[index];
                hourlyDiv.querySelector('.hourlyHour').textContent = time;
                hourlyDiv.querySelector('.hourlyTemp').textContent = `${temp}°C`;
                hourlyDiv.querySelector('.hourlyIcon').src = weatherIcon;
                hourlyDiv.querySelector('.hourlySpeed').textContent = `${entry.wind.speed} km/h`;
                hourlyDiv.querySelector('.hourlyArrow').style.transform = `rotate(${entry.wind.deg}deg)`;

                index++;
            }
        });
    }

}
function getNextDay(currentDate) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
}


async function fetchCitySuggestions(query) {
    if (!query) return []; // Don't make an API call if query is empty
    try {
      const response = await fetch(`https://api.api-ninjas.com/v1/city?name=${query}&limit=10`, {
        method: 'GET',
        headers: { 'X-Api-Key': API_KEY },
      });
      
      if (!response.ok) {
          console.error('Error fetching cities:', response.statusText);
          return [];
        }

        const data = await response.json();
        return data;

    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }


  function updateCityList(cities,query) {
    cityList.innerHTML = ''; // Clear previous suggestions
  
    cities.forEach(city => {
        const cityName = city.name.toLowerCase();
        const queryLower = query.toLowerCase();

        // Match both city name and country
        if (cityName.startsWith(queryLower) || city.country.toLowerCase().startsWith(queryLower)) {
            const option = document.createElement('option');
            option.value = city.name;
            option.text = `${city.name}, ${city.country}`;
            cityList.appendChild(option);
            cityList.style.backgroundColor = red;
        }
    });
    cityList.hidden = cities.length === 0; 
    
  }




document.getElementById('search-bar').addEventListener('input', async (event) => {
    const query = event.target.value.trim();
    if (query.length < 2) {
        cityList.innerHTML = ''; 
        cityList.hidden = true; 
        return;
    }

    const cities = await fetchCitySuggestions(query);
    updateCityList(cities, query);
});

document.getElementById('search-bar').addEventListener('change', (event) => {
    const selectedCity = event.target.value.trim();
    if (selectedCity) {
        cityList.hidden = true; 
        fetchWeather(selectedCity);
        fetchForecast(selectedCity);
    }
});


