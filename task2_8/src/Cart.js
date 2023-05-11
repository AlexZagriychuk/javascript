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
        this.findProductObjectById = this.findProductObjectById.bind(this)
        this.calculateCartTotalPrice = this.calculateCartTotalPrice.bind(this)
        this.renderShoppingCartTotalPrice = this.renderShoppingCartTotalPrice.bind(this)
        this.handleIncreaseProductCount = this.handleIncreaseProductCount.bind(this)
        this.handleDecreaseProductCount = this.handleDecreaseProductCount.bind(this)
        this.handleRemoveProduct = this.handleRemoveProduct.bind(this)
        this.renderProductCartCountChanges = this.renderProductCartCountChanges.bind(this)

        this.cartIconElem = document.querySelector(".header-cart")
        this.cartProductsCountElem = document.getElementById("cart-products-count")
        this.cartIFrameElem = document.querySelector("iframe.shopping-cart-iframe")
        this.closeShoppingCartBtnElem = this.cartIFrameElem.contentDocument.getElementById("close-shopping-cart-btn")
        this.shoppingCartItemsListElem = this.cartIFrameElem.contentDocument.querySelector(".shopping-cart-items")
        this.shoppingCartTotalElem = this.cartIFrameElem.contentDocument.getElementById("shopping-cart-total")

        this.productsData = productsData
        this.productObjects = []
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
            let productCountIncreaseElem = ElementUtils.createAndAppendElement(productCountControlsElem, "button", "shopping-cart-product-count-increase")
            ElementUtils.createAndAppendElement(productCountControlsElem, "span", "shopping-cart-product-count", cartProductCount)
            let productCountDecreaseElem = ElementUtils.createAndAppendElement(productCountControlsElem, "button", "shopping-cart-product-count-decrease")

            removeBtn.addEventListener("click", this.handleRemoveProduct)
            productCountIncreaseElem.addEventListener("click", this.handleIncreaseProductCount)
            productCountDecreaseElem.addEventListener("click", this.handleDecreaseProductCount)
        }

        this.renderShoppingCartTotalPrice()
    }

    findProductDataById(cartProductId) {
        cartProductId = parseInt(cartProductId)
        return this.productsData.find(productData => productData.id === cartProductId)
    }

    findProductObjectById(cartProductId) {
        cartProductId = parseInt(cartProductId)
        let product = this.productObjects.find(productObj => productObj.id === cartProductId)
        return product ? product.productObj : null
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

    renderShoppingCartTotalPrice() {
        this.shoppingCartTotalElem.innerText = this.calculateCartTotalPrice().toFixed(2)
    }

    handleIncreaseProductCount(event) {
        let cartProductElem = ElementUtils.getParentElementByClassName(event.target, "shopping-cart-product")
        let cartProductCount = parseInt(cartProductElem.querySelector(".shopping-cart-product-count").innerText)
        let newCartProductCount = cartProductCount + 1

        this.renderProductCartCountChanges(cartProductElem, newCartProductCount)
    }

    handleDecreaseProductCount(event) {
        let cartProductElem = ElementUtils.getParentElementByClassName(event.target, "shopping-cart-product")
        let cartProductCount = parseInt(cartProductElem.querySelector(".shopping-cart-product-count").innerText)
        let newCartProductCount = cartProductCount - 1

        if(newCartProductCount < 0) {
            // Can't subtract below 0  
            return
        }

        this.renderProductCartCountChanges(cartProductElem, newCartProductCount)
    }

    handleRemoveProduct(event) {
        let cartProductElem = ElementUtils.getParentElementByClassName(event.target, "shopping-cart-product")
        this.renderProductCartCountChanges(cartProductElem, 0)
        cartProductElem.remove()
    }

    renderProductCartCountChanges(cartProductElem, newProductCount) {
        let cartProductCountElem = cartProductElem.querySelector(".shopping-cart-product-count")
        
        let productId = parseInt(cartProductElem.getAttribute("data-product-id"))
        this.updateCart(productId, newProductCount)
        cartProductCountElem.innerText = newProductCount
        this.renderShoppingCartTotalPrice()

        // Update Product count on the main page (outside of the Cart sidebar). Only if this page has products rendered
        let productObj = this.findProductObjectById(productId)
        if(productObj) {
            productObj.renderProductCount(newProductCount)
        }
    }
}
