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

    static createAndAppendTextNode(appendToNode, textContent) {
        let newTextNode = document.createTextNode(textContent)
        appendToNode.appendChild(newTextNode)
        return newTextNode
    }
}
