import { Validator } from "./Validator.js"

let statusMessageElem = document.getElementById("status-message")

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
