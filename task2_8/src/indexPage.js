import { getAllProducts } from "./api/productsApi.js";
import Product from "./Product.js";
import Cart from "./Cart.js"


Cart.renderCartTotalCount()
const cartData = Cart.getCartData()

const products = await getAllProducts()
const featuredProducts = products.filter(product => product.isFeatured)

featuredProducts.forEach(featuredProduct => {
    featuredProduct.cartCount = cartData[featuredProduct.id]
})

const featuredProductsListElem = document.querySelector(".featured-products") 

featuredProducts.forEach(featuredProduct => {
    Product.render(featuredProduct, featuredProductsListElem) 
})