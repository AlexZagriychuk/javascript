import JsUtils from "./utils/JsUtils.js"
import ElementUtils from "./utils/ElementUtils.js";


export default class ProductFilters {
    constructor(productsData) {
        // Binding class methods to the class instance
        this.handleProductNameFilterChange = this.handleProductNameFilterChange.bind(this);
        this.handleCompanyNameFilterChange = this.handleCompanyNameFilterChange.bind(this);
        this.handlePriceFilterChange = this.handlePriceFilterChange.bind(this)
        this.handleProductFilterChange = this.showProductsBasedOnFiltersValues.bind(this);

        this.productNameFilterValue = ""
        this.companyNameFilterValue = "All"
        let maxProductPriceCeil = Math.max(...productsData.map(product => Math.ceil(parseFloat(product.price))))
        this.priceFilterValue = maxProductPriceCeil

        this.productsData = productsData
        this.productElements = Array.from(document.querySelectorAll(".product"))
        this.productNameFilterElem = document.getElementById("products-filter-product-name")
        this.productCompaniesListFilterElem = document.querySelector(".products-filter-company-list")
        this.priceFilterSliderElem = document.getElementById("price-range")
        this.priceFilterValueElem = document.getElementById("price-filter-value")

        // Product name filters
        this.productNameFilterElem.addEventListener("input", JsUtils.debounce(this.handleProductNameFilterChange))

        // Companies names filters. Generating the list based on the productsData (+ "All" to show all companies)
        let companyNameFilterElem = ElementUtils.createAndAppendElement(this.productCompaniesListFilterElem, "li", "active", "All")
        companyNameFilterElem.addEventListener("click", this.handleCompanyNameFilterChange)

        let companyNames = new Set(productsData.map(product => product.brand))
        companyNames.forEach(companyName => {
            let companyNameFilterElem = ElementUtils.createAndAppendElement(this.productCompaniesListFilterElem, "li", "", companyName)
            companyNameFilterElem.addEventListener("click", this.handleCompanyNameFilterChange)
        })

        // Price filters
        this.priceFilterSliderElem.max = maxProductPriceCeil
        this.priceFilterSliderElem.value = maxProductPriceCeil
        this.priceFilterValueElem.innerText = maxProductPriceCeil
        this.priceFilterSliderElem.addEventListener("change", this.handlePriceFilterChange)
    }


    handleProductNameFilterChange(event) {        
        this.productNameFilterValue = event.target.value
        this.showProductsBasedOnFiltersValues()
    }

    handleCompanyNameFilterChange(event) {     
        const clickedCompanyNameFilterElement = event.target
        this.companyNameFilterValue = clickedCompanyNameFilterElement.innerText

        const companyNameFilterElements = Array.from(this.productCompaniesListFilterElem.querySelectorAll("li"))
        companyNameFilterElements.forEach(companyNameFilterElem => companyNameFilterElem.classList.remove("active"))
        clickedCompanyNameFilterElement.classList.add("active")

        this.showProductsBasedOnFiltersValues()
    }

    handlePriceFilterChange(event) {        
        this.priceFilterValue = event.target.value
        this.priceFilterValueElem.innerText = this.priceFilterValue

        this.showProductsBasedOnFiltersValues()
    }

    showProductsBasedOnFiltersValues() {
        this.productElements.forEach((productElem, index) => {
            // Instead of reading the product data from the DOM, to increase speed we read it from the productsData arr (which is used to render this list of products)
            let productData = this.productsData[index]
            let satisfiesProductNameFilter = productData.name.toLowerCase().includes(this.productNameFilterValue.toLowerCase())
            let satisfiesCompanyNameFilter = this.companyNameFilterValue.toLowerCase() === "all" || this.companyNameFilterValue === productData.brand
            let satisfiesPriceFilter = parseFloat(productData.price) <= parseFloat(this.priceFilterValue)

            let shouldBeDisplayed = satisfiesProductNameFilter && satisfiesCompanyNameFilter && satisfiesPriceFilter
            productElem.style.display = shouldBeDisplayed ? "" : "none"
        })
    }
}