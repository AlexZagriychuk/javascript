import EmailValidator from "./EmailValidator.js"
import DateValidator from "./DateValidator.js"

export class Validator {
    isEmail(email) {
        return EmailValidator.isValid(email)
    }

    isDate(date) {
        return DateValidator.isValid(date)
    }
}