import { getAllProducts } from "./api/productsApi.js";
import Product from "./Product.js";
import Cart from "./Cart.js"
import ProductFilters from "./ProductFilters.js";

const productsListElem = document.querySelector(".products-cards") 

const productsData = await getAllProducts()

// Cart must be initialized only after products data has been fetched
const cart = new Cart(productsData)
const cartData = cart.getCartData()

productsData.forEach(productData => {
    productData.cartCount = cartData[productData.id]

    let product = new Product(productData, cart)
    product.render(productsListElem)
    cart.productObjects.push({id: productData.id, productObj: product})
})

// Product filters must be initialized only after all products have been rendered
const productFilters = new ProductFilters(productsData)