import { getAllProducts } from "./api/productsApi.js";
import Product from "./Product.js";
import Cart from "./Cart.js"


Cart.renderCartTotalCount()
const cartData = Cart.getCartData()

const products = await getAllProducts()
products.forEach(product => {
    // Navigate out of the current folder "pages" (for the product.html file) to correctly generate the full path to imageURL  
    product.imageURL = "../" + product.imageURL

    product.cartCount = cartData[product.id]
})

const productsListElem = document.querySelector(".products-cards") 

products.forEach(product => {
    Product.render(product, productsListElem) 
})