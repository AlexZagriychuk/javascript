import EmailValidator from "./EmailValidator.js"

export class Validator {
    isEmail(email) {
        return EmailValidator.isValid(email)
    }
}