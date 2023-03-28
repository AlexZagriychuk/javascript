import { Validator } from "./Validator.js"

const statusMessageElem = document.getElementById("status-message")

document.getElementById("validate-email").addEventListener("click", event => {
    let emailValue = document.getElementById("email").value
    
    if(new Validator().isEmail(emailValue)) {
        statusMessageElem.textContent = `Email '${emailValue}' is valid`
        statusMessageElem.style.color = "green"
    } else {
        statusMessageElem.textContent = `Email '${emailValue}' is not valid`
        statusMessageElem.style.color = "red"
    }
})

document.getElementById("validate-date").addEventListener("click", event => {
    let dateValue = document.getElementById("date").value
    
    if(new Validator().isDate(dateValue)) {
        statusMessageElem.textContent = `Date '${dateValue}' is valid`
        statusMessageElem.style.color = "green"
    } else {
        statusMessageElem.textContent = `Date '${dateValue}' is not valid`
        statusMessageElem.style.color = "red"
    }
})
