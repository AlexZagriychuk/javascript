export default class CountriesAPI {
    static async getCountries() {
        let res = await fetch("https://restcountries.com/v3.1/all")
        return await res.json()
    }

    static async getCountriesParsedData() {
        let countriesData = await this.getCountries()

        let countriesDataParsed = countriesData.map(country => {
            return {
                name : country.name.common, // country.name.official is too long and not what we are looking for
                flagUrl : country.flags.png,
                flagAltText : country.flags.alt,
                population : country.population,
                region : country.region,
                capital : country.capital && country.capital.toString() || ""
            }
        })
        
        // sort by name
        countriesDataParsed.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
            return -1;
            }
            if (nameA > nameB) {
            return 1;
            }
        
            // names must be equal
            return 0;
        });

        return countriesDataParsed
    }
}
