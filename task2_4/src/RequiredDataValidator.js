export default class RequiredDataValidator {
    static isValid(data) {
        // Data is valid if string is not empty and does not consist of only spaces or line terminator characters
        return data.trim().length > 0
    }
}
