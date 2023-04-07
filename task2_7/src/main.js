import CountriesAPI from "./api/CountriesAPI.js";
import ElementUtils from "./ElementUtils.js";


const countriesParsedData = await CountriesAPI.getCountriesParsedData()
const countriesListElem = document.querySelector(".search-results")
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



renderCountries(countriesParsedData)
populateRegionFilterSelectOptions(countriesParsedData)

