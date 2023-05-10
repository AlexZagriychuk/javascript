export default class Cart {
    static updateCart(productId, newProductCartCount) {
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

    static getCartData() {
        return JSON.parse(localStorage.getItem("comfy-cart")) || {}
    }

    static renderCartTotalCount(cartTotalCount = parseInt(localStorage.getItem("comfy-cart-total"))) {
        const cartProductsCountElem = document.getElementById("cart-products-count")
        cartProductsCountElem.innerText = cartTotalCount
    }
}
