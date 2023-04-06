import ElementUtils from "./ElementUtils.js"
import CookieUtils from "./CookiesUtils.js"

const oneDayInMs = 24*60*60*1000 // 1 day


export default class ToDoList {
    inputItemTextElem

    renderNewListItem(itemText) {
        let listItemElem = ElementUtils.createAndAppendElement(this.itemsListElem, "li", "list-item")
        ElementUtils.createAndAppendElement(listItemElem, "div", "list-item-text", itemText)
        let listItemButtonsElem = ElementUtils.createAndAppendElement(listItemElem, "div", "list-item-btns")
        let editListItemButton = ElementUtils.createAndAppendElement(listItemButtonsElem, "i", "fa-solid fa-pen-to-square")
        let removeListItemButton = ElementUtils.createAndAppendElement(listItemButtonsElem, "i", "fa-solid fa-trash")

        editListItemButton.addEventListener("click", this.activateListItemEditingMode)
        removeListItemButton.addEventListener("click", this.handleRemoveListItem)
    }

    handleAddItem(event) {
        let newItemText = this.inputItemTextElem.value.trim()

        if(newItemText !== "") {
            this.itemsListData.push(newItemText)
            this.renderNewListItem(newItemText)
            this.updateToDoListCookie()
        }

        this.inputItemTextElem.value = ""
    }

    getListItemIndexInTheList(listItemElem) {
        let listElem = ElementUtils.getParentElementByClassName(listItemElem, "items-list")

        // Getting index of the list item which need to be removed (to remove it from cached data and the cookie) 
        let itemsElemChildren = Array.from(listElem.querySelectorAll(".list-item"))
        for(let i = 0; i < itemsElemChildren.length; i++) {
            if(itemsElemChildren[i] === listItemElem) {
                return i
            }
        }

        return -1
    }

    handleRemoveListItem(event) {
        let listItemElemToRemove = ElementUtils.getParentElementByClassName(event.target, "list-item")
        let listItemToRemoveIndex = this.getListItemIndexInTheList(listItemElemToRemove)

        // Remove element from DOM, from the array itemsListData with cached data, and from the cookie 
        listItemElemToRemove.remove()

        if(listItemToRemoveIndex < 0) {
            console.error("[ToDoList.handleRemoveListItem] cannot calculate index of the list item that need to be removed in its parent list element")
        } else {
            this.itemsListData.splice(listItemToRemoveIndex, 1)
        }

        this.updateToDoListCookie()
    }

    activateListItemEditingMode(event) {
        let listItemElemToEdit = ElementUtils.getParentElementByClassName(event.target, "list-item")
        // If we click edit on the same element we are currently editing then we cancel the editing process
        if(listItemElemToEdit === this.listElementBeingEdited) {
            this.deactivateListItemEditingMode()
            return
        }

        let listElem = ElementUtils.getParentElementByClassName(listItemElemToEdit, "items-list")
        
        // Remove the "editing" class from all list items (if another editing is in progress) and add this class to the current list item only
        Array.from(listElem.querySelectorAll(".list-item")).forEach(listItemElem => {
            listItemElem.classList.remove("editing")
        })
        listItemElemToEdit.classList.add("editing")

        // Save the element being currently edited into the variable 
        this.listElementBeingEdited = listItemElemToEdit

        // Activate the edit button and deactivate the add button
        this.editItemButton.style.display = "block"
        this.addItemButton.style.display = "none"

        // Set current list element value into the input value (to be able to edit it)
        let listItemText = listItemElemToEdit.querySelector(".list-item-text").textContent
        this.inputItemTextElem.value = listItemText
        this.inputItemTextElem.focus()
    }

    deactivateListItemEditingMode() {
        if(this.listElementBeingEdited) {
            this.listElementBeingEdited.classList.remove("editing")
            this.listElementBeingEdited = null
        }

        this.addItemButton.style.display = "block"
        this.editItemButton.style.display = "none"
        this.inputItemTextElem.value = ""
    }

    handleFinishListItemEditing() {
        let listItemToEditIndex = this.getListItemIndexInTheList(this.listElementBeingEdited)
        let newListItemValue = this.inputItemTextElem.value.trim()
        this.listElementBeingEdited.querySelector(".list-item-text").textContent = newListItemValue

        if(listItemToEditIndex < 0) {
            console.error("[ToDoList.handleFinishListItemEditing] cannot calculate index of the list item that need to be edited in its parent list element")
        } else {
            this.itemsListData[listItemToEditIndex] = newListItemValue
        }

        this.deactivateListItemEditingMode()
        this.updateToDoListCookie()
    }

    handleClearAllItems(event) {
        this.itemsListElem.innerHTML = ""
        this.itemsListData = []
        this.updateToDoListCookie()
    }

    updateToDoListCookie() {
        const cookieExpirationTime = 10*24*60*60*1000 // 10 days
        CookieUtils.setCookie(this.cookieName, JSON.stringify(this.itemsListData), cookieExpirationTime)
    }

    
    constructor(cookieName = "ToDo_list_data", cookieExpirationTime = 10 * oneDayInMs) {
        this.cookieName = cookieName
        this.cookieExpirationTime = cookieExpirationTime
        this.itemsListData = []
        this.listElementBeingEdited = null

        this.addItemButton = document.getElementById("add-item-btn")
        this.editItemButton = document.getElementById("edit-item-btn")
        this.inputItemTextElem = document.getElementById("add-edit-item-input")
        this.statusMessageElem = document.getElementById("status-message")
        this.itemsListElem = document.querySelector(".items-list")
        this.clearItemsButton = document.getElementById("clear-items-btn")

        // Binding class methods to the class instance
        this.renderNewListItem = this.renderNewListItem.bind(this);
        this.handleAddItem = this.handleAddItem.bind(this);
        this.getListItemIndexInTheList = this.getListItemIndexInTheList.bind(this);
        this.handleRemoveListItem = this.handleRemoveListItem.bind(this);
        this.activateListItemEditingMode = this.activateListItemEditingMode.bind(this);
        this.deactivateListItemEditingMode = this.deactivateListItemEditingMode.bind(this);
        this.handleFinishListItemEditing = this.handleFinishListItemEditing.bind(this);
        this.handleClearAllItems = this.handleClearAllItems.bind(this);
        this.updateToDoListCookie = this.updateToDoListCookie.bind(this);

        // Exporting data into the this.itemsListData arr from the cookie if it is present
        let dataFromCookie = CookieUtils.getDataFromCookie(cookieName)
        if(dataFromCookie) {
            this.itemsListData = JSON.parse(dataFromCookie)
            this.itemsListData.forEach(listItemText => this.renderNewListItem(listItemText))
        }

        // Add event listeners
        this.inputItemTextElem.addEventListener("input", event => {
            let inputText = event.target.value.trim()
            let statusMessageIsHidden = this.statusMessageElem.style.visibility === "hidden"

            if(inputText === "" && statusMessageIsHidden) {
                this.statusMessageElem.style.visibility = ""
                this.statusMessageElem.textContent = "Input value must not be empty"
            } else if(inputText !== "" && !statusMessageIsHidden) {
                this.statusMessageElem.style.visibility = "hidden"
            }
        })
        this.addItemButton.addEventListener("click", this.handleAddItem)
        this.editItemButton.addEventListener("click", this.handleFinishListItemEditing)
        this.clearItemsButton.addEventListener("click", this.handleClearAllItems)

        document.addEventListener("keydown", event => {
            // If list item editing is in process and escape key is pressed, cancel the editing process
            let isEscape = (event.key === "Escape" || event.key === "Esc")
            if(isEscape && this.listElementBeingEdited) {
                this.deactivateListItemEditingMode()
            }
        })
    }
}