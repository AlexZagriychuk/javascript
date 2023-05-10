import ElementUtils from "./utils/ElementUtils.js"


export default class Product {
    static render(productObj, appendToNode) {
        let listElem = ElementUtils.createAndAppendElement(appendToNode, "li", "product")
        let productImgDivElem = ElementUtils.createAndAppendElement(listElem, "div", "product-img")
        ElementUtils.createAndAppendElement(productImgDivElem, "img", "", "", [{name: "src", value: productObj.imageURL}, {name: "alt", value: ""}])
        let productCartControlsElem = ElementUtils.createAndAppendElement(productImgDivElem, "div", "product-cart-controls")
        ElementUtils.createAndAppendElement(productCartControlsElem, "button", "product-cart-control-minus")
        ElementUtils.createAndAppendElement(productCartControlsElem, "span", "product-cart-control-count", "0")
        ElementUtils.createAndAppendElement(productCartControlsElem, "button", "product-cart-control-plus")

        ElementUtils.createAndAppendElement(listElem, "div", "product-name", productObj.name)
        ElementUtils.createAndAppendElement(listElem, "div", "product-price", productObj.price)
    }
}