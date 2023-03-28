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

export async function getCurrentWeatherByCityCoordinates(latitude, longitude) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`) 
    return await response.json()
}

// 5 day weather forecast with 3 hour step
export async function getWeatherForecastByCityCoordinates(latitude, longitude) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`) 
    return await response.json()
}

export async function getDailyWeatherForecastByCityCoordinates(latitude, longitude) {
    // Free subscription does not have access to the daily weather forecast https://openweathermap.org/forecast16 API
    // As a workaround, we fetch 5 day weather forecast with 3 hour step (40 data points), group results by date and parse them into a daily forecast
    let weatherForecastData = await getWeatherForecastByCityCoordinates(latitude, longitude)

    // Grouping weather forecast data points by date
    let dataGroupedByDate = weatherForecastData.list.reduce((acc, dataPoint) => {
        let dateStr = dataPoint.dt_txt.split(" ")[0]
        if(!acc[dateStr]) {
            acc[dateStr] = []
        }
        acc[dateStr].push(dataPoint)
        return acc
    }, {})

    // Generating the daily forecasts
    let dailyForecasts = Object.keys(dataGroupedByDate).map(dateStr => {
        let dataPointsForDate = dataGroupedByDate[dateStr] 
        
        // Calculate min and max temperature for a chosen date (dateStr)
        let dailyMinMaxTemp = dataPointsForDate.reduce((acc, dataPoint) => {
            acc.min = Math.min(dataPoint.main.temp_min, acc.min)
            acc.max = Math.max(dataPoint.main.temp_max, acc.max)
            return acc
        }, {min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER})

        // For simplicity sake returning the "weather" of the last data point for a chosen date (dateStr) because calculating "average weather" would require a lot of analysis to figure out how to approach this problem
        let dailyWeather = dataPointsForDate[dataPointsForDate.length - 1].weather

        return {date_txt: dateStr, temp: dailyMinMaxTemp, weather: dailyWeather} 
    })

    // Replacing "weatherForecastData.list" (40 data points with 3 hour step) with our generated daily forecast data
    weatherForecastData.list = dailyForecasts
    weatherForecastData.cnt = dailyForecasts.length
    return weatherForecastData
}
