import EmailValidator from "./EmailValidator.js"
import DateValidator from "./DateValidator.js"
import RequiredDataValidator from "./RequiredDataValidator.js"

export class Validator {
    static isEmail(email) {
        return EmailValidator.isValid(email)
    }

    static isDate(date) {
        return DateValidator.isValid(date)
    }

    static isRequired(data) {
        return RequiredDataValidator.isValid(data)
    }
}