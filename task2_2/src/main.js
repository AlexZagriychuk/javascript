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

const FoodType = {
    Breakfast : "breakfast",
    Lunch : "lunch",
    Dinner : "dinner",
    Shakes : "shakes"
}

class MenuItem {
    constructor(name, type, price, picturePath, description) {
        this.name = name
        this.type = type
        this.price = price
        this.picturePath = picturePath
        this.description = description
    }

    render(parentNode) {
        let menuItemElem = createAndAppendElement(parentNode, "div", "menu-item", "", [{name: "data-food-type", value: this.type}])
        
        let menuItemPicElem = createAndAppendElement(menuItemElem, "div", "menu-item-pic")
        createAndAppendElement(menuItemPicElem, "img", "", "", [{name: "src", value: this.picturePath}, {name: "alt", value: this.type}])

        let menuItemInfoElem = createAndAppendElement(menuItemElem, "div", "menu-item-info")
        
        let menuItemNameAndPriceElem = createAndAppendElement(menuItemInfoElem, "div", "menu-item-name-and-price")
        createAndAppendElement(menuItemNameAndPriceElem, "span", "menu-item-name", this.name)
        createAndAppendElement(menuItemNameAndPriceElem, "span", "menu-item-price", this.price)

        createAndAppendElement(menuItemInfoElem, "div", "menu-item-description", this.description)
    }
}

function verifyPageElementsAttributes() {
    const allowedFoodTypes = Object.values(FoodType)
    
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


// Rendering menu items and verifying the rendered elements attributes
const menuItemsData = [
    new MenuItem("Nut-Chateau Waffle (with whipped cream)", FoodType.Breakfast, "$19.00", "resources/breakfast_1.jpeg", "A full sized waffle with whipped cream, Nutella and your choice of strawberries or banana toppings"),
    new MenuItem("World Famous Milkshakes", FoodType.Shakes, "$8.29", "resources/shake_1.jpeg", "All made with our premium rich ice cream and topped with whipped cream. Choose from Chocolate, Vanilla Bean, Strawberry, Blueberry or Salted Caramel Brownie."),
    new MenuItem("Chicken & Mushroom Alfredo", FoodType.Dinner, "$24.79", "resources/dinner_1.jpeg", "Lemon-chargrilled fresh BC chicken breast, Parmesan cream sauce with sautéed mushrooms, green onion & spinach. Gluten-free penne & no bread."),
    new MenuItem("Clam Chowder Bowl", FoodType.Lunch, "$8.29", "resources/lunch_1.jpeg", "Our signature soup."),
    new MenuItem("Club sandwich", FoodType.Lunch, "$20.89", "resources/lunch_2.jpeg", "Turkey breast, bacon, lettuce, tomato, mayo & chili sauce on your choice of toasted white, multigrain, or sourdough. Served with your choice of side (extra charges may apply)."),
    new MenuItem("New York Steak Frites (9 oz)", FoodType.Dinner, "$34.09", "resources/dinner_2.jpeg", "Chargrilled 9 oz Canadian Certified Angus Beef® New York Striploin. Garlic Bacon Parmesan fries & arugula."),
    new MenuItem("Butter Pecan Tart Shake", FoodType.Shakes, "$8.79", "resources/shake_2.jpeg", ">Premium-rich vanilla bean ice cream, salted caramel & our butter pecan tart. Hand-scooped & served with a malt cup on the side."),
    new MenuItem("Banana Nation Waffle (with whipped cream)", FoodType.Breakfast, "$18.00", "resources/breakfast_2.jpeg", "Banana with chocolate sauce & whipped cream on a full sized waffle."),
    new MenuItem("Croissant", FoodType.Breakfast, "$8.75", "resources/breakfast_3.jpeg", "Freshly Made Mochi Croissant"),
    new MenuItem("Chicken Caesar Wrap", FoodType.Lunch, "$19.29", "resources/lunch_3.jpeg", "Herb-marinated BC chicken OR crispy buttermilk chicken wrapped in our salsa tortilla with crisp romaine, bacon & Parmesan, tossed in our signature Caesar dressing. Served with your choice of side (extra charges may apply)."),
    new MenuItem("Teriyaki Donburi Bowl", FoodType.Lunch, "$23.09", "resources/lunch_4.jpeg", "Fresh chicken breast or Wild Pacific Sockeye Salmon, served with broccoli, red pepper, carrots, mushrooms & edamame sautéed in our house-made teriyaki sauce. Jasmine rice."),
    new MenuItem("Double Double Burger", FoodType.Dinner, "$22.59", "resources/dinner_3.jpeg", "A 1/2 lb of 100% fresh Canadian beef. Double beef patties, double cheese, lettuce, tomato, Triple 'O' sauce & double dills. Served with your choice of side (extra charges may apply)."),
]

let menuItemsParentElem = document.querySelector(".menu-items")
menuItemsData.forEach(menuItem => menuItem.render(menuItemsParentElem))
verifyPageElementsAttributes()

// Attaching listeners to the ".food-type-btn" buttons
Array.from(document.querySelectorAll(".food-type-btn")).forEach(foodTypeBtn => {
    foodTypeBtn.addEventListener("click", event => {
        let foodType = event.target.id.replace("food-type-", "")
        updateMenuItemsVisibility(foodType)
    })
})
