import { getAllProducts } from "./api/productsApi.js";
import Product from "./Product.js";
import Cart from "./Cart.js"
import ProductFilters from "./ProductFilters.js";

const productsListElem = document.querySelector(".products-cards") 

Cart.renderCartTotalCount()
const cartData = Cart.getCartData()

const products = await getAllProducts()
products.forEach(product => {
    product.imageURL = "../" + product.imageURL // Navigate out of the current folder "pages" (for the product.html file) to generate the full path to imageURL
    product.cartCount = cartData[product.id]

    Product.render(product, productsListElem) 
})

// Product filters must be initialized only after all products have been rendered
const productFilters = new ProductFilters(products)