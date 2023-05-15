import { getAllProducts } from "./api/productsApi.js";
import Product from "./Product.js";
import Cart from "./Cart.js"


const featuredProductsListElem = document.querySelector(".featured-products") 

const productsData = await getAllProducts()

// Cart must be initialized only after products data has been fetched
const cart = new Cart(productsData)
const cartData = cart.getCartData()

const featuredProducts = productsData.filter(product => product.isFeatured)
featuredProducts.forEach(featuredProductData => {
    featuredProductData.cartCount = cartData[featuredProductData.id]
    let product = new Product(featuredProductData, cart)
    product.render(featuredProductsListElem)
    cart.productObjects.push({id: featuredProductData.id, productObj: product})
})