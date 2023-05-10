import JsUtils from "./utils/JsUtils.js"
import ElementUtils from "./utils/ElementUtils.js";


export default class ProductFilters {
    constructor(productsData) {
        // Binding class methods to the class instance
        this.handleProductNameFilterChange = this.handleProductNameFilterChange.bind(this);
        this.handleCompanyNameFilterChange = this.handleCompanyNameFilterChange.bind(this);
        this.handleProductFilterChange = this.handleProductFilterChange.bind(this);

        this.productNameFilterValue = ""
        this.companyNameFilterValue = "All"

        this.productsData = productsData
        this.productElements = Array.from(document.querySelectorAll(".product"))
        this.productNameFilterElem = document.getElementById("products-filter-product-name")
        this.productCompaniesListFilterElem = document.querySelector(".products-filter-company-list")

        // Generate list of companies names filters based on the productsData (+ "All" to show all companies)
        let companyNameFilterElem = ElementUtils.createAndAppendElement(this.productCompaniesListFilterElem, "li", "active", "All")
        companyNameFilterElem.addEventListener("click", this.handleCompanyNameFilterChange)

        let companyNames = new Set(productsData.map(product => product.brand))
        companyNames.forEach(companyName => {
            let companyNameFilterElem = ElementUtils.createAndAppendElement(this.productCompaniesListFilterElem, "li", "", companyName)
            companyNameFilterElem.addEventListener("click", this.handleCompanyNameFilterChange)
        })

        // Add event listeners
        this.productNameFilterElem.addEventListener("input", JsUtils.debounce(this.handleProductNameFilterChange))
    }


    handleProductNameFilterChange(event) {        
        this.productNameFilterValue = event.target.value
        this.handleProductFilterChange()
    }

    handleCompanyNameFilterChange(event) {     
        const clickedCompanyNameFilterElement = event.target
        this.companyNameFilterValue = clickedCompanyNameFilterElement.innerText

        const companyNameFilterElements = Array.from(this.productCompaniesListFilterElem.querySelectorAll("li"))
        companyNameFilterElements.forEach(companyNameFilterElem => companyNameFilterElem.classList.remove("active"))
        clickedCompanyNameFilterElement.classList.add("active")

        this.handleProductFilterChange()
    }

    handleProductFilterChange() {
        this.productElements.forEach((productElem, index) => {
            // Instead of reading the product data from the DOM, to increase speed we read it from the productsData arr (which is used to render this list of products)
            let productData = this.productsData[index]
            let satisfyProductNameFilter = productData.name.toLowerCase().includes(this.productNameFilterValue.toLowerCase())
            let satisfyCompanyNameFilter = this.companyNameFilterValue.toLowerCase() === "all" || this.companyNameFilterValue === productData.brand

            productElem.style.display = satisfyProductNameFilter && satisfyCompanyNameFilter ? "" : "none"
        })
    }
}