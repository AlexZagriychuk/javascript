export default class ElementUtils {
    static createAndAppendElement(appendToNode, elementTag, className = "", textContent = "", attributes = []) {
        let newElem = document.createElement(elementTag)
        
        if(className !== "") {
            newElem.className = className
        }
        if(textContent !== "") {
            newElem.textContent = textContent
        }
        attributes.forEach(attribute => newElem.setAttribute(attribute.name, attribute.value))
    
        appendToNode.appendChild(newElem)
        return newElem
    }
    
    // Returns the parent element with required class or returns null
    static getParentElementByClassName(currElem, parentClassName) {
        let parentElement = currElem.parentElement
    
        while(parentElement !== null && !parentElement.classList.contains(parentClassName)) {
            parentElement = parentElement.parentElement
        }
    
        return parentElement // can be null
    }
}