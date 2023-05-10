export default class Cart {
    constructor(productsData) {
        // Binding class methods to the class instance
        this.updateCart = this.updateCart.bind(this);
        this.getCartData = this.getCartData.bind(this);
        this.renderCartTotalCount = this.renderCartTotalCount.bind(this)
        this.handleCartSideBarActivation = this.handleCartSideBarActivation.bind(this)
        this.handleCartSideBarClose = this.handleCartSideBarClose.bind(this)

        this.cartIconElem = document.querySelector(".header-cart")
        this.cartProductsCountElem = document.getElementById("cart-products-count")
        this.cartIFrameElem = document.querySelector("iframe.shopping-cart-iframe")
        this.closeShoppingCartBtnElem = this.cartIFrameElem.contentDocument.getElementById("close-shopping-cart-btn")

        this.productsData = productsData

        this.renderCartTotalCount()
        this.cartIconElem.addEventListener("click", this.handleCartSideBarActivation)
        this.closeShoppingCartBtnElem.addEventListener("click", this.handleCartSideBarClose)
    }

    getCartData() {
        return JSON.parse(localStorage.getItem("comfy-cart")) || {}
    }

    updateCart(productId, newProductCartCount) {
        let comfyCartData = this.getCartData()

        if(newProductCartCount == 0) {
            // Removing the product ID from the cart (because the new count for this product is 0)
            delete comfyCartData[productId]
        } else {
            comfyCartData[productId] = newProductCartCount
        }

        let comfyCartDataStr = JSON.stringify(comfyCartData)
        localStorage.setItem("comfy-cart", comfyCartDataStr)

        let comfyCartTotal = Object.values(comfyCartData).reduce((a, b) => a + b, 0)
        localStorage.setItem("comfy-cart-total", comfyCartTotal)

        this.renderCartTotalCount(comfyCartTotal)
    }

    renderCartTotalCount(cartTotalCount = parseInt(localStorage.getItem("comfy-cart-total"))) {
        this.cartProductsCountElem.innerText = cartTotalCount
    }

    handleCartSideBarActivation(event) {
        this.cartIFrameElem.classList.add("active")
    }

    handleCartSideBarClose(event) {
        this.cartIFrameElem.classList.remove("active")    
    }
}
