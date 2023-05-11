import ElementUtils from "./utils/ElementUtils.js"

export default class Product {
    constructor(productData, cartObj) {
        // Binding class methods to the class instance
        this.render = this.render.bind(this);
        this.handleIncreaseProductCount = this.handleIncreaseProductCount.bind(this);
        this.handleDecreaseProductCount = this.handleDecreaseProductCount.bind(this);
        this.renderProductCount = this.renderProductCount.bind(this);

        this.productData = productData
        this.cartObj = cartObj

        this.productCartControlCountElem = null // will be initialized in the render method
    }

    render(appendToNode) {
        let productElem = ElementUtils.createAndAppendElement(appendToNode, "li", "product", "", [{name: "data-product-id", value: this.productData.id}])
        let productImgDivElem = ElementUtils.createAndAppendElement(productElem, "div", "product-img")
        ElementUtils.createAndAppendElement(productImgDivElem, "img", "", "", [{name: "src", value: this.productData.imageURL}, {name: "alt", value: ""}])
        let productCartControlsElem = ElementUtils.createAndAppendElement(productImgDivElem, "div", "product-cart-controls")
        let productCartControlMinusElem = ElementUtils.createAndAppendElement(productCartControlsElem, "button", "product-cart-control-minus")
        let productCartControlCountElem = ElementUtils.createAndAppendElement(productCartControlsElem, "span", "product-cart-control-count", this.productData.cartCount || 0)
        let productCartControlPlusElem = ElementUtils.createAndAppendElement(productCartControlsElem, "button", "product-cart-control-plus")

        ElementUtils.createAndAppendElement(productElem, "div", "product-name", this.productData.name)
        ElementUtils.createAndAppendElement(productElem, "div", "product-price", this.productData.price)

        productCartControlPlusElem.addEventListener("click", this.handleIncreaseProductCount)
        productCartControlMinusElem.addEventListener("click", this.handleDecreaseProductCount)

        this.productCartControlCountElem = productCartControlCountElem
    }

    handleIncreaseProductCount(event) {
        let productCartCount = parseInt(this.productCartControlCountElem.innerText)
        let newProductCartCount = productCartCount + 1

        this.renderProductCount(newProductCartCount)
        this.cartObj.updateCart(this.productData.id, newProductCartCount)
    }

    handleDecreaseProductCount(event) {
        let productCartCount = parseInt(this.productCartControlCountElem.innerText)
        let newProductCartCount = productCartCount - 1

        if(newProductCartCount < 0) {
            // Can't subtract below 0  
            return
        }

        this.renderProductCount(newProductCartCount)
        this.cartObj.updateCart(this.productData.id, newProductCartCount)
    }

    renderProductCount(productCount) {
        this.productData.productCount = productCount
        this.productCartControlCountElem.innerText = productCount
    }
}