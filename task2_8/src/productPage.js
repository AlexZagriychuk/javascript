import { getAllProducts } from "./api/productsApi.js";
import Product from "./Product.js";
import Cart from "./Cart.js"
import ProductFilters from "./ProductFilters.js";

const productsListElem = document.querySelector(".products-cards") 

const products = await getAllProducts()

// Cart must be initialized only after products data has been fetched
const cart = new Cart(products)
const cartData = cart.getCartData()

products.forEach(productData => {
    productData.imageURL = "../" + productData.imageURL // Navigate out of the current folder "pages" (for the product.html file) to generate the full path to imageURL
    productData.cartCount = cartData[productData.id]

    let product = new Product(productData, cart)
    product.render(productsListElem) 
})

// Product filters must be initialized only after all products have been rendered
const productFilters = new ProductFilters(products)