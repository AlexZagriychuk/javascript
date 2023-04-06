let itemsListData = []
const cookieName = "ToDo_list_data"
const cookieExpirationTime = 10*24*60*60*1000 // 10 days

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
        updateToDoListCookie()
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

    if(listItemToRemoveIndex < 0) {
        console.error("[handleRemoveListItem] cannot calculate index of the list item that need to be removed in its parent list element")
    } else {
        itemsListData.splice(listItemToRemoveIndex, 1)
    }

    updateToDoListCookie()

    //ToDo: remove TMP
    console.log(itemsListData)
}

function handleEditListItem(event) {
    // ToDo: implement Edit Button click handling

    // ToDo: update edited item in the itemsListData
    updateToDoListCookie()
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
    console.log("now.toUTCString() before=",now.toUTCString())
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
clearItemsButton.addEventListener("click", handleClearAllItems)
