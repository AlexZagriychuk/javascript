import JsUtils from "./utils/JsUtils.js"


export default class ProductFilters {
    constructor(productsData) {
        // Binding class methods to the class instance
        this.handleProductNameFilterChange = this.handleProductNameFilterChange.bind(this);
        this.handleProductFilterChange = this.handleProductFilterChange.bind(this);

        this.productsData = productsData
        this.productElements = Array.from(document.querySelectorAll(".product"))
        this.productNameFilterElem = document.getElementById("products-filter-product-name")

        this.productNameFilterElem.addEventListener("input", JsUtils.debounce(this.handleProductNameFilterChange))
    }


    handleProductNameFilterChange(event) {        
        this.productNameFilterValue = event.target.value
        this.handleProductFilterChange()
    }

    handleProductFilterChange() {
        this.productElements.forEach((productElem, index) => {
            // Instead of reading a product name value from the DOM we read it from the productsData (which is used to render this list of products)
            let productName = this.productsData[index].name
            let shouldBeVisibleByNameFilter = productName.toLowerCase().includes(this.productNameFilterValue.toLowerCase())

            productElem.style.display = shouldBeVisibleByNameFilter ? "" : "none"
        })
    }
}