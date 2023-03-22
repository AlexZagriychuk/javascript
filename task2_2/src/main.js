function verifyPageElementsAttributes() {
    const allowedFoodTypes = ["breakfast", "lunch", "shakes", "dinner"]
    
    // Every '.food-type-btn' element must have ID which starts with "food-type-" and continue with one of the allowedFoodTypes or 'all'
    const allowedFoodTypeBtnIds = ["food-type-all", ...allowedFoodTypes.map(foodType => "food-type-" + foodType)]
    let foodTypeButtons = Array.from(document.querySelectorAll(".food-type-btn"))
    if(foodTypeButtons.length == 0) {
        throw new Error("No elements with selector '.food-type-btn' are present on the page (buttons to control which menu items to display)")
    }
    foodTypeButtons.forEach(foodTypeButton => {
        if(!allowedFoodTypeBtnIds.includes(foodTypeButton.id.toLowerCase())) {
            throw new Error(`Element with selector '.food-type-btn' does not have one of the allowed 'id' values [${allowedFoodTypeBtnIds}] (actual ID value is '${foodTypeButton.id}')`)
        }
    })

    // Every '.menu-item' element must have 'data-food-type' attribute with one of the allowedFoodTypes
    let menuItems = Array.from(document.querySelectorAll(".menu-item"))
    if(menuItems.length == 0) {
        throw new Error("No elements with selector '.menu-item' are present on the page (no menu items to display)")
    }
    menuItems.forEach(menuItem => {
        let menuItemDataFoodType = menuItem.getAttribute("data-food-type")
        if(menuItemDataFoodType == null || !allowedFoodTypes.includes(menuItemDataFoodType.toLowerCase())) {
            throw new Error(`Element with selector '.menu-item' does not have one of the required 'data-food-type' values [${allowedFoodTypes}] (actual 'data-food-type' value is '${menuItemDataFoodType}')`)
        }
    })
}

function menuItemShouldBeDisplayed(menuItemElem, foodType) {
    foodType = foodType.toLowerCase()
    return foodType == 'all' || foodType == menuItemElem.getAttribute("data-food-type").toLowerCase()
}

function updateMenuItemsVisibility(foodType) {
    let menuItems = Array.from(document.querySelectorAll(".menu-item"))
    menuItems.forEach(menuItem => {
        if(menuItemShouldBeDisplayed(menuItem, foodType)) {
            menuItem.style.display = ''
        } else {
            menuItem.style.display = 'none'
        }
    })
}


verifyPageElementsAttributes()

Array.from(document.querySelectorAll(".food-type-btn")).forEach(foodTypeBtn => {
    foodTypeBtn.addEventListener("click", event => {
        let foodType = event.target.id.replace("food-type-", "")
        updateMenuItemsVisibility(foodType)
    })
})
