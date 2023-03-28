export default class DateValidator {
    static #CURRENT_CENTURY_MIN_YEAR = 2000 // must end with 00
    
    static #daysInMonthsInNonLeapYear = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    }
    
    static #isLeapYear(year) {
        // To be a leap year, the year number must be divisible by four – except for end-of-century years, which must be divisible by 400
        if(year % 100 === 0 && year % 400 !== 0) {
            return false
        }
        const leapYearExample = 2000
        return (year - leapYearExample) % 4 === 0
    }

    // Valid data: month 1-12; date 1-31 (and must be within the allowed range for the specified month)
    static #isValidDateAndMonth(date, month, year) {
        if(month < 1 || month > 12 || date < 1 || date > 31) {
            return false
        }

        let daysInTheMonth = this.#daysInMonthsInNonLeapYear[month]
        if(this.#isLeapYear(year)) {
            daysInTheMonth++
        }
        if(date > daysInTheMonth) {
            return false
        }

        return true
    }
    
    static #parseDate(dateStr) {
        // Regular expression searches for the dates in the following formats:
        // - mm/dd/yy, mm/dd/yyyy, dd/mm/yy, and dd/mm/yyyy (allowing leading zeros in date and month to be omitted)
        const regExp = new RegExp("^([0-3]?[0-9])/([0-3]?[0-9])/(([0-9]{2})?[0-9]{2})$")
        let parsedDateObj = regExp.exec(dateStr)
        if(parsedDateObj) {
            let parsedDateOrMonth1 = parseInt(parsedDateObj[1])
            let parsedDateOrMonth2 = parseInt(parsedDateObj[2])
            let parsedYear = parseInt(parsedDateObj[3])
            if(parsedYear < 100) {
                parsedYear += this.#CURRENT_CENTURY_MIN_YEAR
            }

            if(this.#isValidDateAndMonth(parsedDateOrMonth1, parsedDateOrMonth2, parsedYear)) {
                return {date: parsedDateOrMonth1, month: parsedDateOrMonth2, year: parsedYear}
            } else if(this.#isValidDateAndMonth(parsedDateOrMonth2, parsedDateOrMonth1, parsedYear)) {
                return {date: parsedDateOrMonth2, month: parsedDateOrMonth1, year: parsedYear}
            } else {
                throw new Error(`Date '${dateStr}' is invalid because the first 2 parts ('${parsedDateOrMonth1}/${parsedDateOrMonth2}') cannot be parsed to existing combination of date+month or month+date (for the year ${parsedYear})`)
            }
        } else {
            throw new Error(`Date '${dateStr}' cannot be parsed into any of the following formats: 'mm/dd/yy', 'mm/dd/yyyy', 'dd/mm/yy', and 'dd/mm/yyyy' (allowing leading zeros in date and month to be omitted)`)
        }
    }
    
    static isValid(date) {
        try {
            let parsedDate = this.#parseDate(date)
            console.log("parsedDate = " + JSON.stringify(parsedDate))
            return !!parsedDate
        } catch(error) {
            console.error(error.message)
            return false
        }
    }
}
