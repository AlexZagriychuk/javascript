import ElementUtils from "./utils/ElementUtils.js"


export default class Cart {
    constructor(productsData) {
        // Binding class methods to the class instance
        this.updateCart = this.updateCart.bind(this);
        this.getCartData = this.getCartData.bind(this);
        this.renderCartTotalCount = this.renderCartTotalCount.bind(this)
        this.handleCartSideBarActivation = this.handleCartSideBarActivation.bind(this)
        this.handleCartSideBarClose = this.handleCartSideBarClose.bind(this)
        this.renderCartSidebarData = this.renderCartSidebarData.bind(this)
        this.findProductDataById = this.findProductDataById.bind(this)
        this.calculateCartTotalPrice = this.calculateCartTotalPrice.bind(this)

        this.cartIconElem = document.querySelector(".header-cart")
        this.cartProductsCountElem = document.getElementById("cart-products-count")
        this.cartIFrameElem = document.querySelector("iframe.shopping-cart-iframe")
        this.closeShoppingCartBtnElem = this.cartIFrameElem.contentDocument.getElementById("close-shopping-cart-btn")
        this.shoppingCartItemsListElem = this.cartIFrameElem.contentDocument.querySelector(".shopping-cart-items")
        this.shoppingCartTotalElem = this.cartIFrameElem.contentDocument.getElementById("shopping-cart-total")

        this.productsData = productsData
        this.cartData = this.getCartData()

        this.renderCartTotalCount()
        this.cartIconElem.addEventListener("click", this.handleCartSideBarActivation)
        this.closeShoppingCartBtnElem.addEventListener("click", this.handleCartSideBarClose)
    }

    getCartData() {
        return JSON.parse(localStorage.getItem("comfy-cart")) || {}
    }

    updateCart(productId, newProductCartCount) {
        if(newProductCartCount == 0) {
            // Removing the product ID from the cart (because the new count for this product is 0)
            delete this.cartData[productId]
        } else {
            this.cartData[productId] = newProductCartCount
        }

        let comfyCartDataStr = JSON.stringify(this.cartData)
        localStorage.setItem("comfy-cart", comfyCartDataStr)

        let comfyCartTotal = Object.values(this.cartData).reduce((a, b) => a + b, 0)
        localStorage.setItem("comfy-cart-total", comfyCartTotal)

        this.renderCartTotalCount(comfyCartTotal)
    }

    renderCartTotalCount(cartTotalCount = parseInt(localStorage.getItem("comfy-cart-total"))) {
        this.cartProductsCountElem.innerText = cartTotalCount
    }

    handleCartSideBarActivation(event) {
        this.cartIFrameElem.classList.add("active")
        this.renderCartSidebarData()
    }

    handleCartSideBarClose(event) {
        this.cartIFrameElem.classList.remove("active")    
    }

    renderCartSidebarData() {
        this.shoppingCartItemsListElem.innerHTML = ""

        for(let cartProductId in this.cartData) {
            let cartProductCount = this.cartData[cartProductId]
            let productData = this.findProductDataById(cartProductId)

            let productElem = ElementUtils.createAndAppendElement(this.shoppingCartItemsListElem, "li", "shopping-cart-product","", [{name: "data-product-id", value: cartProductId}])
            ElementUtils.createAndAppendElement(productElem, "img", "shopping-cart-product-pic", "", [{name: "src", value: productData.imageURL}, {name: "alt", value: ""}])
    
            let productInfoAndRemoveBtnElem = ElementUtils.createAndAppendElement(productElem, "div", "shopping-cart-product-info-and-remove-btn")
            ElementUtils.createAndAppendElement(productInfoAndRemoveBtnElem, "div", "shopping-cart-product-name", productData.name)
            ElementUtils.createAndAppendElement(productInfoAndRemoveBtnElem, "div", "shopping-cart-product-price", productData.price)
            let removeBtn = ElementUtils.createAndAppendElement(productInfoAndRemoveBtnElem, "button", "shopping-cart-product-remove-btn", "remove")

            let productCountControlsElem = ElementUtils.createAndAppendElement(productElem, "div", "shopping-cart-product-count-controls")
            ElementUtils.createAndAppendElement(productCountControlsElem, "button", "shopping-cart-product-count-increase")
            ElementUtils.createAndAppendElement(productCountControlsElem, "span", "shopping-cart-product-count", cartProductCount)
            ElementUtils.createAndAppendElement(productCountControlsElem, "button", "shopping-cart-product-count-decrease")
        }

        this.shoppingCartTotalElem.innerText = this.calculateCartTotalPrice().toFixed(2)
    }

    findProductDataById(cartProductId) {
        cartProductId = parseInt(cartProductId)
        return this.productsData.find(productData => productData.id === cartProductId)
    }

    calculateCartTotalPrice() {
        let cartTotalPrice = 0

        for(let cartProductId in this.cartData) {
            let cartProductCount = this.cartData[cartProductId]
            let productData = this.findProductDataById(cartProductId)
            cartTotalPrice += parseFloat(productData.price) * cartProductCount
        }

        return cartTotalPrice
    }
}
