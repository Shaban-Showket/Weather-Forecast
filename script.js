const timeE1 = document.getElementById("time");
const dateE1 = document.getElementById("date");
const currentWeatherItemsE1 = document.getElementById("current-weather-items");
const weatherForecastE1 = document.getElementById("weather-forecast");
const currentTempE1 = document.getElementById("current-temp");
const city = document.querySelector(".cityname");
const button = document.querySelector(".button");
document.querySelector(".second").style.display = "none";
// document.querySelector(".first").style.display = "none";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let api = ``;


// var element = document.querySelector(".second");
// element.style.display = "none";

const API_KEY = `20cf390c74e5eb73528a04dee1baddec`;
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const day = time.getDay();
    const hour = time.getHours();
    const date = time.getDate();
    const minutes = time.getMinutes();
    const hoursIn12HrsFormat = hour >= 13 ? hour % 12 : hour;
    const ampm = hour >= 12 ? "PM" : "AM";

    timeE1.innerHTML = ((hoursIn12HrsFormat < 10) ? '0' + hoursIn12HrsFormat : hoursIn12HrsFormat) + ":" + ((minutes < 10) ? ('0' + minutes) : minutes) + " " + `<span id="am-pm">${ampm}</span>`;

    dateE1.innerHTML = days[day] + ", " + date + "," + months[month]

}, 1000);


// getWeatherData();

/* 
button.addEventListener("click", () => {

        navigator.geolocation.getCurrentPosition((success) => {

            let { latitude, longitude } = success.coords;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
                console.log(data);
                showWeatherData(data);
            });

        })
    }) */


button.addEventListener("click", () => {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, failure);

    } else {
        console.log("Your browser does't geolocation");
    }
});



function success(position) {
    let { latitude, longitude } = position.coords;

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data);
        showWeatherData(data);
    });

}

function failure() {
    console.log("dehli")

    let latitude = 28.65195;

    let longitude = 77.23149;

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data);
        showWeatherData(data);
    });
}

city.addEventListener("keyup", e => {
    // if user press enter btn and inmputfield value is not empty
    if (e.key == "Enter" && e.value != "") {
        requestApi(city.value);
    }
});

function requestApi(val) {
    console.log(val);
    let latitude = 0,
        longitude = 0;
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${val}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`;
    fetch(api).then(res => res.json()).then(data => {
        console.log(data.coord.lon);
        console.log(data.coord.lat);
        latitude = data.coord.lat;
        longitude = data.coord.lon;
        console.log(latitude, longitude);
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        });
    });




}

function showWeatherData(data) {
    document.querySelector(".first").style.display = "none";
    document.querySelector(".second").style.display = "block";
    let { humidity, pressure, sunrise, sunset, wind_speed } = data["current"];


    currentWeatherItemsE1.innerHTML =
        `
                   <h2> Todays Weather Details</h2>
                    <div class="weather-items">
                        <div>Humidity :-  </div>
                        <div>${humidity}%</div>
                    </div>
                    <hr>
                    <div class="weather-items">
                        <div>Pressure :-  </div>
                        <div>${pressure}</div>
                    </div>  <hr>
                    <div class="weather-items">
                        <div>Wind Speed :-  </div>
                        <div>${wind_speed}</div>
                    </div>  <hr>
                    <div class="weather-items">
                        <div>Sunrise :-     </div>
                        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
                    </div>  <hr>
                    <div class="weather-items">
                        <div>Sunset :-     </div>
                        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
                    </div>
    `



    let otherDayForcast = '';
    data.daily.forEach((day, idx) => {
        if (idx == 0) {

            currentTempE1.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png

            " alt="Weather Icon" class="w-icon">
            <div class="others">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <div class="temp">Night ${day.temp.night}&#176;C</div>
                <div class="temp">Day ${day.temp.day}&#176;C</div>
            </div>
        
            `
        } else {
            otherDayForcast += `
        <div class="weather-forecast-item">
        <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png

        " alt="Weather Icon" class="w-icon">
        <div class="temp">Night ${day.temp.night}&#176;C</div>
        <div class="temp">Day ${day.temp.day}&#176;C</div>

    </div>
        `
        }

    })
    weatherForecastE1.innerHTML = otherDayForcast;
}