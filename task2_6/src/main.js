let itemsListData = []
const cookieName = "ToDo_list_data"
const cookieExpirationTime = 10*24*60*60*1000 // 10 days

const addItemButton = document.getElementById("add-item-btn")
const editItemButton = document.getElementById("edit-item-btn")
const inputItemTextElem = document.getElementById("add-edit-item-input")
const statusMessageElem = document.getElementById("status-message")
const itemsListElem = document.querySelector(".items-list")
const clearItemsButton = document.getElementById("clear-items-btn")

let listElementBeingEdited = null


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
    createAndAppendElement(listItemElem, "div", "list-item-text", itemText)
    let listItemButtonsElem = createAndAppendElement(listItemElem, "div", "list-item-btns")
    let editListItemButton = createAndAppendElement(listItemButtonsElem, "i", "fa-solid fa-pen-to-square")
    let removeListItemButton = createAndAppendElement(listItemButtonsElem, "i", "fa-solid fa-trash")

    editListItemButton.addEventListener("click", handleStartListItemEditing)
    removeListItemButton.addEventListener("click", handleRemoveListItem)
}

function handleAddItem(event) {
    let newItemText = inputItemTextElem.value.trim()

    if(newItemText !== "") {
        itemsListData.push(newItemText)
        renderNewListItem(newItemText)
        updateToDoListCookie()
    }

    inputItemTextElem.value = ""
}

function getListItemIndexInTheList(listItemElem) {
    let listElem = getParentElementByClassName(listItemElem, "items-list")

    // Getting index of the list item which need to be removed (to remove it from cached data and the cookie) 
    let itemsElemChildren = Array.from(listElem.querySelectorAll(".list-item"))
    for(let i = 0; i < itemsElemChildren.length; i++) {
        if(itemsElemChildren[i] === listItemElem) {
            return i
        }
    }

    return -1
}

function handleRemoveListItem(event) {
    let listItemElemToRemove = getParentElementByClassName(event.target, "list-item")
    let listItemToRemoveIndex = getListItemIndexInTheList(listItemElemToRemove)

    // Remove element from DOM, from the array itemsListData with cached data, and from the cookie 
    listItemElemToRemove.remove()

    if(listItemToRemoveIndex < 0) {
        console.error("[handleRemoveListItem] cannot calculate index of the list item that need to be removed in its parent list element")
    } else {
        itemsListData.splice(listItemToRemoveIndex, 1)
    }

    updateToDoListCookie()
}

function handleStartListItemEditing(event) {
    let listItemElemToEdit = getParentElementByClassName(event.target, "list-item")
    // If we click edit on the same element we are currently editing then we cancel the editing process
    if(listItemElemToEdit === listElementBeingEdited) {
        deactivateListItemEditingMode()
        return
    }

    let listElem = getParentElementByClassName(listItemElemToEdit, "items-list")
    
    // Remove the "editing" class from all list items (if another editing is in progress) and add this class to the current list item only
    Array.from(listElem.querySelectorAll(".list-item")).forEach(listItemElem => {
        listItemElem.classList.remove("editing")
    })
    listItemElemToEdit.classList.add("editing")

    // Save the element being currently edited into the variable 
    listElementBeingEdited = listItemElemToEdit

    // Activate the edit button and deactivate the add button
    editItemButton.style.display = "block"
    addItemButton.style.display = "none"

    // Set current list element value into the input value (to be able to edit it)
    let listItemText = listItemElemToEdit.querySelector(".list-item-text").textContent
    inputItemTextElem.value = listItemText
    inputItemTextElem.focus()
}

function handleFinishListItemEditing() {
    let listItemToEditIndex = getListItemIndexInTheList(listElementBeingEdited)
    let newListItemValue = inputItemTextElem.value.trim()
    listElementBeingEdited.querySelector(".list-item-text").textContent = newListItemValue

    if(listItemToEditIndex < 0) {
        console.error("[handleFinishListItemEditing] cannot calculate index of the list item that need to be edited in its parent list element")
    } else {
        itemsListData[listItemToEditIndex] = newListItemValue
    }

    deactivateListItemEditingMode()
    updateToDoListCookie()
}

function deactivateListItemEditingMode() {
    if(listElementBeingEdited) {
        listElementBeingEdited.classList.remove("editing")
        listElementBeingEdited = null
    }

    addItemButton.style.display = "block"
    editItemButton.style.display = "none"
    inputItemTextElem.value = ""
}

function handleClearAllItems(event) {
    itemsListElem.innerHTML = ""
    itemsListData = []
    updateToDoListCookie(cookieName)
}

function getDataFromCookie(cookieName) {
    let cookie = {}
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=')
      cookie[k.trim()] = v
    })
    return cookie[cookieName]
}

function updateToDoListCookie() {
    let now = new Date()
    var expireTime = now.getTime() + cookieExpirationTime
    now.setTime(expireTime)
    document.cookie = `${cookieName}=${JSON.stringify(itemsListData)};expires=${now.toUTCString()};path=/`
}



// Exporting data into the itemsListData arr from the cookie if it is present
let dataFromCookie = getDataFromCookie(cookieName)
if(dataFromCookie) {
    itemsListData = JSON.parse(dataFromCookie)
    itemsListData.forEach(listItemText => renderNewListItem(listItemText))
}

inputItemTextElem.addEventListener("input", event => {
    let inputText = event.target.value.trim()
    let statusMessageIsHidden = statusMessageElem.style.visibility === "hidden"

    if(inputText === "" && statusMessageIsHidden) {
        statusMessageElem.style.visibility = ""
        statusMessageElem.textContent = "Input value must not be empty"
    } else if(inputText !== "" && !statusMessageIsHidden) {
        statusMessageElem.style.visibility = "hidden"
    }
})
addItemButton.addEventListener("click", handleAddItem)
editItemButton.addEventListener("click", handleFinishListItemEditing)
clearItemsButton.addEventListener("click", handleClearAllItems)

document.addEventListener("keydown", event => {
    // If list item editing is in process and escape key is pressed, cancel the editing process
    let isEscape = (event.key === "Escape" || event.key === "Esc")
    if(isEscape && listElementBeingEdited) {
        deactivateListItemEditingMode()
    }
})