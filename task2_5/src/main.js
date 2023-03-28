import { getCitiesByName, getCurrentWeatherByCityCoordinates, getDailyWeatherForecastByCityCoordinates } from "./api/weatherAPI.js"
import { getCountryCodes } from "./api/countryCodesAPI.js"


const COUNTRY_CODES = await getCountryCodes();


function debounce(func, timeout = 500) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => func.apply(this, args), timeout)
    }
}

function getDayName(dateStr, isAbbreviated = false) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const abbreviatedDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    let date = new Date(dateStr)
    let dayIdx = date.getUTCDay()
    if(isAbbreviated) {
        return abbreviatedDays[dayIdx]
    } else {
        return daysOfWeek[dayIdx]
    }
}

function renderFoundCities(cities) {
    let foundCitiesListElem = document.getElementById("search-results-list")
    foundCitiesListElem.innerHTML = ""

    if(cities.length === 0) {
        let listElem = document.createElement("li")
        listElem.setAttribute("data-no-results-found", true)
        listElem.textContent = "No results found... Please try another city name"
        listElem.style.color = "red"
        foundCitiesListElem.appendChild(listElem)
        return
    }

    cities.forEach((city, idx) => {
        let listElem = document.createElement("li")

        // Replacing 'city.country' with country name found by country code or keep the country code if country name is not found
        let countryName = COUNTRY_CODES[city.country]
        if(countryName) {
            city.country = countryName
        }

        listElem.textContent = `${city.name}, ${city.state ? city.state + ", " : ""}${city.country}`
        listElem.setAttribute("data-search-result-index", idx) // This index will allow to access already fetched city data (coordinates) from the sessionStorage 
        foundCitiesListElem.appendChild(listElem)
    });

    // Keeping the cities in the session storage to access the city coordinates when one of the created above list elements is clicked (without repeating the API request)
    sessionStorage.setItem("citiesSearchResults", JSON.stringify(cities));
}

function renderCurrentWeather({city, state, country, temp, feelsLikeTemp, weatherStatus, weatherIcon}) {
    //ToDo remove TMP
    window.renderCurrentWeatherData = arguments[0]
    console.log("renderCurrentWeatherData", arguments[0])

    // ToDo: implement rendering

}

function renderDailyWeatherForecasts(dailyForecasts) {
    //ToDo remove TMP
    window.renderDailyWeatherForecastData = arguments[0]
    console.log("renderDailyWeatherForecastData", arguments[0])
   
    // ToDo: implement rendering
    dailyForecasts.forEach((dailyForecast) => {
        let {day, weatherIcon, weatherDescription, minTemp, maxTemp} = dailyForecast
        console.log(day, weatherIcon, weatherDescription, minTemp, maxTemp)
    })
}

async function fetchAndRenderWeatherForecastByCity({name, state, country, lat, lon}) {
    Promise.all([
        getCurrentWeatherByCityCoordinates(lat, lon),
        getDailyWeatherForecastByCityCoordinates(lat, lon)
    ]).then(data => {
        let currentWeather = data[0]
        let dailyWeatherForecast = data[1]

        let currentWeatherParsedData = {city: name, state, country, weatherStatus: currentWeather.weather[0].main, weatherIcon: currentWeather.weather[0].icon,
                                        temp: Math.round(currentWeather.main.temp), feelsLikeTemp: Math.round(currentWeather.main.feels_like)} 

        // We only need first 5 days from the results (sometimes results have 6 elements, for example: 1/2 of today + 4 full days + 1/2 of the 6th day)
        let dailyWeatherForecastParsedData = []
        for(let i = 0; i < 5; i++) {
            let weatherForecast = dailyWeatherForecast.list[i]
            let dayName = getDayName(weatherForecast.date_txt, true).toUpperCase()
            let parsedDataObj = {day: dayName, weatherIcon: weatherForecast.weather[0].icon, weatherDescription: weatherForecast.weather[0].description, 
                                minTemp: Math.round(weatherForecast.temp.min), maxTemp: Math.round(weatherForecast.temp.max)}
            dailyWeatherForecastParsedData.push(parsedDataObj)
        }

        renderCurrentWeather(currentWeatherParsedData)
        renderDailyWeatherForecasts(dailyWeatherForecastParsedData)

    }).catch(error => {
        console.error(error);
    })
}

const processCountrySearchInput = debounce(async (event) => {
    let citySearchInput = event.target.value.trim()
    
    //ToDo: remove TMP
    console.log(`Search input value = '${citySearchInput}'`)
    
    let foundCities = await getCitiesByName(citySearchInput)
    renderFoundCities(foundCities)
})

function processSearchResultClick(event) {
    let noResultsFound = event.target.getAttribute("data-no-results-found")
    if(noResultsFound) {
        return
    }
    
    // Set the value of the clicked search result city into the input city search field and into the currently chosen city field  
    let currentCity = event.target.innerText
    document.getElementById("selected-city-txt").textContent = currentCity
    citySearchInputElem.value = currentCity

    // Empty the search results list after one of the elements was selected (clicked)
    searchResultsListElem.innerHTML = ""

    // Get city data (primarily interested in coordinates) from the sessionStorage by city "data-search-result-index" of the clicked search results list element 
    let dataSearchResultIndex = event.target.getAttribute("data-search-result-index")
    let citiesSearchResults = JSON.parse(sessionStorage.getItem("citiesSearchResults"))
    let foundCityData = citiesSearchResults[dataSearchResultIndex]

    fetchAndRenderWeatherForecastByCity(foundCityData)
}


const searchResultsListElem = document.getElementById("search-results-list")
const citySearchInputElem = document.getElementById("city-search")

citySearchInputElem.addEventListener("input", processCountrySearchInput)
searchResultsListElem.addEventListener("click", processSearchResultClick)
