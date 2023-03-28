import { getCitiesByName } from "./api/weatherAPI.js"
import { getCountryCodes } from "./api/countryCodesAPI.js"


const COUNTRY_CODES = await getCountryCodes();


function debounce(func, timeout = 500) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => func.apply(this, args), timeout)
    }
}

function renderFoundCities(cities) {
    let foundCitiesListElem = document.getElementById("search-results-list")
    foundCitiesListElem.innerHTML = ""

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

function fetchAndRenderWeatherDataByCity({name, state, country, lat, lon}) {
    //ToDo: implement weather data fetching for this city coordinates
    console.log(`cityData: name = ${name}; state = ${state}; country = ${country}; lat = ${lat}; lon = ${lon}`)
}

const processCountrySearchInput = debounce(async (event) => {
    let citySearchInput = event.target.value.trim()
    
    //ToDo: remove TMP
    console.log(`Search input value = '${citySearchInput}'`)
    
    let foundCities = await getCitiesByName(citySearchInput)
    renderFoundCities(foundCities)
})

function processSearchResultClick(event) {
    // Set the value of the clicked search result city into the input city search field and into the currently chosen city field  
    let currentCity = event.target.innerText
    document.getElementById("current-city-txt").textContent = currentCity
    citySearchInputElem.value = currentCity

    // Empty the search results list after one of the elements was selected (clicked)
    searchResultsListElem.innerHTML = ""

    // Get city data (primarily interested in coordinates) from the sessionStorage by city "data-search-result-index" of the clicked search results list element 
    let dataSearchResultIndex = event.target.getAttribute("data-search-result-index")
    let citiesSearchResults = JSON.parse(sessionStorage.getItem("citiesSearchResults"))
    let foundCityData = citiesSearchResults[dataSearchResultIndex]

    fetchAndRenderWeatherDataByCity(foundCityData)
}


const searchResultsListElem = document.getElementById("search-results-list")
const citySearchInputElem = document.getElementById("city-search")

citySearchInputElem.addEventListener("input", processCountrySearchInput)
searchResultsListElem.addEventListener("click", processSearchResultClick)
