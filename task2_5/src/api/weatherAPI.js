const API_KEY = "f972c20eda72449ee5fab618e026d695"

//'city' name can include {city name},{state code},{country code} 
export async function getCitiesByName(city) {
    if(city.trim() === "") {
        return []
    }

    // limit=5 is max (cannot fetch more cities from this API)
    let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`) 
    return await response.json()
}