import { getAllProducts } from "./api/productsApi.js";
import Product from "./Product.js";


const products = await getAllProducts()
const featuredProducts = products.filter(product => product.isFeatured)

const featuredProductsListElem = document.querySelector(".featured-products") 

featuredProducts.forEach(featuredProduct => {
    Product.render(featuredProduct, featuredProductsListElem) 
})