import CountriesAPI from "./api/CountriesAPI.js";
import ElementUtils from "./ElementUtils.js";
import JsUtils from "./JsUtils.js";

const countriesParsedData = await CountriesAPI.getCountriesParsedData()
const countriesListElem = document.querySelector(".search-results")
const countrySearchInputElem = document.getElementById("country-search-input")
const regionFilterSelectElem = document.getElementById("region-filter-select")


function renderCountries(countriesParsedData) {
    countriesParsedData.forEach(country => {
        let countryCardElem = ElementUtils.createAndAppendElement(countriesListElem, "li", "country-card")
        ElementUtils.createAndAppendElement(countryCardElem, "img", "country-flag", "", [{name: "src", value: country.flagUrl}, {name: "alt", value: country.flagAltText}])
        let countryInfoElem = ElementUtils.createAndAppendElement(countryCardElem, "div", "country-info")
        ElementUtils.createAndAppendElement(countryInfoElem, "div", "country-name", country.name)
        
        let populationElem = ElementUtils.createAndAppendElement(countryInfoElem, "div")
        ElementUtils.createAndAppendElement(populationElem, "span", "bold", "Population: ")
        ElementUtils.createAndAppendTextNode(populationElem, country.population.toLocaleString())
        
        let regionElem = ElementUtils.createAndAppendElement(countryInfoElem, "div")
        ElementUtils.createAndAppendElement(regionElem, "span", "bold", "Region: ")
        ElementUtils.createAndAppendTextNode(regionElem, country.region)

        let capitalElem = ElementUtils.createAndAppendElement(countryInfoElem, "div")
        ElementUtils.createAndAppendElement(capitalElem, "span", "bold", "Capital: ")
        ElementUtils.createAndAppendTextNode(capitalElem, country.capital)
    })
}

function populateRegionFilterSelectOptions(countriesParsedData) {
    let regionsSet = countriesParsedData.reduce((acc, curr) => {
        acc.add(curr.region)
        return acc
    }, new Set())

    let regionsArr = [...regionsSet]
    regionsArr.sort()

    regionsArr.forEach((region, index) => {
        ElementUtils.createAndAppendElement(regionFilterSelectElem, "option", "", region, [{name: "value", value: index}])
    })
}

// Filtering by both country name (case insensitive) and region value at the same time
function handleFilterChange(event) {
    let countryNameFilter = countrySearchInputElem.value.trim()
    let regionFilterSelectedOption = regionFilterSelectElem.options[regionFilterSelectElem.selectedIndex]
    let regionFilterValue = regionFilterSelectedOption.value.trim()
    let regionFilterText = regionFilterSelectedOption.text.trim()

    if(regionFilterText === "") {
        // Select default option with value "" (and text "Filter by Region") if option with empty text is selected (region filter is deactivated)
        regionFilterSelectElem.value = ""
        regionFilterValue = ""
    }   

    let countryCards = Array.from(countriesListElem.querySelectorAll(".country-card"))
    // Iterating over the cached data (countriesParsedData) to figure out which country items need to be hidden (instead of reading data from the DOM elements which would be slower)
    countriesParsedData.forEach((country, index) => {
        let countryCardIsCurrentlyDisplayed = countryCards[index].style.display !== "none"
        let countryCardShouldBeVisible = country.name.toLowerCase().includes(countryNameFilter.toLowerCase()) 
                                        && (regionFilterValue === "" || country.region === regionFilterText) 

        if(countryCardShouldBeVisible && !countryCardIsCurrentlyDisplayed) {
            countryCards[index].style.display = ""
        } else if (!countryCardShouldBeVisible && countryCardIsCurrentlyDisplayed) {
            countryCards[index].style.display = "none"
        }
    }) 
}


renderCountries(countriesParsedData)
populateRegionFilterSelectOptions(countriesParsedData)
countrySearchInputElem.addEventListener("input", JsUtils.debounce((event) => handleFilterChange(event)))
regionFilterSelectElem.addEventListener("change", handleFilterChange)

