import ElementUtils from "./utils/ElementUtils.js"
import Cart from "./Cart.js"

export default class Product {
    static render(productObj, appendToNode) {
        let listElem = ElementUtils.createAndAppendElement(appendToNode, "li", "product", "", [{name: "data-product-id", value: productObj.id}])
        let productImgDivElem = ElementUtils.createAndAppendElement(listElem, "div", "product-img")
        ElementUtils.createAndAppendElement(productImgDivElem, "img", "", "", [{name: "src", value: productObj.imageURL}, {name: "alt", value: ""}])
        let productCartControlsElem = ElementUtils.createAndAppendElement(productImgDivElem, "div", "product-cart-controls")
        let productCartControlMinusElem = ElementUtils.createAndAppendElement(productCartControlsElem, "button", "product-cart-control-minus")
        ElementUtils.createAndAppendElement(productCartControlsElem, "span", "product-cart-control-count", productObj.cartCount || 0)
        let productCartControlPlusElem = ElementUtils.createAndAppendElement(productCartControlsElem, "button", "product-cart-control-plus")

        ElementUtils.createAndAppendElement(listElem, "div", "product-name", productObj.name)
        ElementUtils.createAndAppendElement(listElem, "div", "product-price", productObj.price)

        productCartControlPlusElem.addEventListener("click", this.handleAddProduct)
        productCartControlMinusElem.addEventListener("click", this.handleSubtractProduct)
    }

    static handleAddProduct(event) {
        let productCartControlsElem = ElementUtils.getParentElementByClassName(event.target, "product-cart-controls")
        let productCartControlCountElem = productCartControlsElem.querySelector(".product-cart-control-count")
        let productCartCount = parseInt(productCartControlCountElem.innerText)
        let newProductCartCount = productCartCount + 1

        let productElem = ElementUtils.getParentElementByClassName(event.target, "product")
        let productId = parseInt(productElem.getAttribute("data-product-id"))

        productCartControlCountElem.innerText = newProductCartCount
        Cart.updateCart(productId, newProductCartCount)
    }

    static handleSubtractProduct(event) {
        let productCartControlsElem = ElementUtils.getParentElementByClassName(event.target, "product-cart-controls")
        let productCartControlCountElem = productCartControlsElem.querySelector(".product-cart-control-count")
        let productCartCount = parseInt(productCartControlCountElem.innerText)
        let newProductCartCount = productCartCount - 1

        if(productCartCount == 0) {
            // Can't subtract below 0  
            return
        }

        let productElem = ElementUtils.getParentElementByClassName(event.target, "product")
        let productId = parseInt(productElem.getAttribute("data-product-id"))

        productCartControlCountElem.innerText = newProductCartCount
        Cart.updateCart(productId, newProductCartCount)
    }
}