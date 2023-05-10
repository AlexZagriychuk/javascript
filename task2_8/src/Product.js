import ElementUtils from "./utils/ElementUtils.js"

export default class Product {
    constructor(productData, cartObj) {
        // Binding class methods to the class instance
        this.render = this.render.bind(this);
        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleSubtractProduct = this.handleSubtractProduct.bind(this);

        this.productData = productData
        this.cartObj = cartObj
    }

    render(appendToNode) {
        let listElem = ElementUtils.createAndAppendElement(appendToNode, "li", "product", "", [{name: "data-product-id", value: this.productData.id}])
        let productImgDivElem = ElementUtils.createAndAppendElement(listElem, "div", "product-img")
        ElementUtils.createAndAppendElement(productImgDivElem, "img", "", "", [{name: "src", value: this.productData.imageURL}, {name: "alt", value: ""}])
        let productCartControlsElem = ElementUtils.createAndAppendElement(productImgDivElem, "div", "product-cart-controls")
        let productCartControlMinusElem = ElementUtils.createAndAppendElement(productCartControlsElem, "button", "product-cart-control-minus")
        ElementUtils.createAndAppendElement(productCartControlsElem, "span", "product-cart-control-count", this.productData.cartCount || 0)
        let productCartControlPlusElem = ElementUtils.createAndAppendElement(productCartControlsElem, "button", "product-cart-control-plus")

        ElementUtils.createAndAppendElement(listElem, "div", "product-name", this.productData.name)
        ElementUtils.createAndAppendElement(listElem, "div", "product-price", this.productData.price)

        productCartControlPlusElem.addEventListener("click", this.handleAddProduct)
        productCartControlMinusElem.addEventListener("click", this.handleSubtractProduct)
    }

    handleAddProduct(event) {
        let productCartControlsElem = ElementUtils.getParentElementByClassName(event.target, "product-cart-controls")
        let productCartControlCountElem = productCartControlsElem.querySelector(".product-cart-control-count")
        let productCartCount = parseInt(productCartControlCountElem.innerText)
        let newProductCartCount = productCartCount + 1

        let productElem = ElementUtils.getParentElementByClassName(event.target, "product")
        let productId = parseInt(productElem.getAttribute("data-product-id"))

        productCartControlCountElem.innerText = newProductCartCount
        this.cartObj.updateCart(productId, newProductCartCount)
    }

    handleSubtractProduct(event) {
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
        this.cartObj.updateCart(productId, newProductCartCount)
    }
}