let itemsListData = []
const addItemButton = document.getElementById("add-item-btn")
const editItemButton = document.getElementById("edit-item-btn")
const inputItemTextElem = document.getElementById("add-edit-item-input")
const statusMessageElem = document.getElementById("status-message")
const itemsListElem = document.querySelector(".items-list")
const clearItemsButton = document.getElementById("clear-items-btn")


function createAndAppendElement(appendToNode, elementTag, className = "", textContent = "", attributes = []) {
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
function getParentElementByClassName(currElem, parentClassName) {
    let parentElement = currElem.parentElement

    while(parentElement !== null && !parentElement.classList.contains(parentClassName)) {
        parentElement = parentElement.parentElement
    }

    return parentElement // can be null
} 

function renderNewListItem(itemText) {
    let listItemElem = createAndAppendElement(itemsListElem, "li", "list-item")
    createAndAppendElement(listItemElem, "div", "", itemText)
    let listItemButtonsElem = createAndAppendElement(listItemElem, "div", "list-item-btns")
    let editListItemButton = createAndAppendElement(listItemButtonsElem, "i", "fa-solid fa-pen-to-square")
    let removeListItemButton = createAndAppendElement(listItemButtonsElem, "i", "fa-solid fa-trash")

    editListItemButton.addEventListener("click", event => {
        window.clickedTarget = event.target
        console.log("window.clickedTarget = " + clickedTarget)
    })

    removeListItemButton.addEventListener("click", handleRemoveListItem)
}

function handleAddItem(event) {
    let newItemText = inputItemTextElem.value.trim()

    if(newItemText !== "") {
        itemsListData.push(newItemText)
        renderNewListItem(newItemText)
        // ToDo: add new item to the cookie data (and refresh cookie expiration date)
    }

    inputItemTextElem.value = ""

    //ToDo: remove TMP
    console.log(itemsListData)
}

function handleRemoveListItem(event) {
    let listItemElemToRemove = getParentElementByClassName(event.target, "list-item")
    let itemsElem = getParentElementByClassName(listItemElemToRemove, "items-list")

    // Getting index of the list item which need to be removed (to remove it from cached data and the cookie) 
    let itemsElemChildren = Array.from(itemsElem.querySelectorAll(".list-item"))
    let listItemToRemoveIndex = -1
    for(let i = 0; i < itemsElemChildren.length; i++) {
        if(itemsElemChildren[i] === listItemElemToRemove) {
            listItemToRemoveIndex = i
            break
        }
    }

    // Remove element from DOM, from the array itemsListData with cached data, and from the cookie 
    listItemElemToRemove.remove()

    if(listItemElemToRemove < 0) {
        console.error("[handleRemoveListItem] cannot calculate index of the list item that need to be removed in its parent list element")
    } else {
        itemsListData.splice(listItemElemToRemove, 1)
    }

    // ToDo: remove deleted item from the cookie data (and refresh cookie expiration date)


    //ToDo: remove TMP
    console.log(itemsListData)
}

function handleEditListItem(event) {
    // ToDo: implement Edit Button click handling

    // ToDo: update edited item in the itemsListData and in the cookie data (and refresh cookie expiration date)
}


function handleClearAllItems(event) {
    itemsListElem.innerHTML = ""
    itemsListData = []

    // ToDo: remove all data from the cookie (and refresh cookie expiration date)

    //ToDo: remove TMP
    console.log(itemsListData)
}




// ToDo: export data from the cookie if it is present 


inputItemTextElem.addEventListener("input", event => {
    let inputText = event.target.value.trim()
    console.log(`inputText = '${inputText}'`)

    if(inputText === "" && statusMessageElem.style.visibility === "hidden") {
        statusMessageElem.style.visibility = ""
        statusMessageElem.textContent = "Input value must not be empty"
    } else if(inputText !== "" && statusMessageElem.style.visibility !== "hidden") {
        statusMessageElem.style.visibility = "hidden"
    }
})
addItemButton.addEventListener("click", handleAddItem)
clearItemsButton.addEventListener("click", handleClearAllItems)
